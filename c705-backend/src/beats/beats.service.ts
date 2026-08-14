import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { UploadBeatDto } from './dto/upload-beat.dto';
import { PurchaseBeatDto } from './dto/purchase-beat.dto';
import { ReportBeatDto } from './dto/report-beat.dto';

@Injectable()
export class BeatsService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  /**
   * Upload a beat. All roles can upload; only PRODUCER and ADMIN can set price > 0 (sell).
   * Others upload for cyphers only (price forced to 0).
   */
  async uploadBeat(
    userId: string,
    uploadDto: UploadBeatDto,
    file: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const canSell = user.role === 'PRODUCER' || user.role === 'ADMIN';
    const price = canSell ? uploadDto.price : 0;

    // Validate audio file
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mp4',
      'audio/m4a',
      'audio/aac',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    // Upload full beat to S3
    const fileExtension = file.originalname.split('.').pop() || 'mp3';
    const fullBeatKey = this.s3Service.generateKey(
      userId,
      `beat-full-${Date.now()}.${fileExtension}`,
      'beats',
    );
    const fullUrl = await this.s3Service.uploadPublicFile(
      file.buffer,
      fullBeatKey,
      file.mimetype,
    );

    // TODO: Generate preview (20-30 seconds) using FFmpeg
    // For now, use the same file as preview (MVP)
    // In production, you'd use FFmpeg to create a 30-second preview
    const previewKey = this.s3Service.generateKey(
      userId,
      `beat-preview-${Date.now()}.${fileExtension}`,
      'beats',
    );
    const previewUrl = await this.s3Service.uploadPublicFile(
      file.buffer,
      previewKey,
      file.mimetype,
    );

    // Create beat record (price 0 for non-Producer/Admin = for cyphers only)
    const beat = await this.prisma.beat.create({
      data: {
        title: uploadDto.title,
        genre: uploadDto.genre,
        bpm: uploadDto.bpm,
        mood: uploadDto.mood,
        previewUrl,
        fullUrl,
        price,
        producerId: userId,
      },
      include: {
        producer: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return beat;
  }

  /**
   * Search beats by title or genre
   */
  async searchBeats(query: string, limit: number = 20) {
    const beats = await this.prisma.beat.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { genre: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        producer: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    return beats;
  }

  /**
   * Get all beats (browse)
   * Supports filtering by genre, BPM, mood
   */
  async getBeats(
    page: number = 1,
    limit: number = 20,
    genre?: string,
    bpm?: number,
    mood?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (genre) {
      where.genre = genre;
    }

    if (bpm) {
      where.bpm = bpm;
    }

    if (mood) {
      where.mood = mood;
    }

    const [beats, total] = await Promise.all([
      this.prisma.beat.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          producer: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          _count: {
            select: {
              purchases: true,
            },
          },
        },
      }),
      this.prisma.beat.count({ where }),
    ]);

    return {
      beats,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get beat by ID
   */
  async getBeatById(beatId: string, userId?: string) {
    const beat = await this.prisma.beat.findUnique({
      where: { id: beatId },
      include: {
        producer: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            purchases: true,
          },
        },
      },
    });

    if (!beat) {
      throw new NotFoundException('Beat not found');
    }

    // Check if user has purchased this beat
    let isPurchased = false;
    if (userId) {
      const purchase = await this.prisma.beatPurchase.findUnique({
        where: {
          beatId_userId: {
            beatId,
            userId,
          },
        },
      });
      isPurchased = !!purchase;
    }

    return {
      ...beat,
      isPurchased,
    };
  }

  /**
   * Purchase a beat (Apple IAP)
   * Receipt validation should happen here
   */
  async purchaseBeat(
    beatId: string,
    userId: string,
    purchaseDto: PurchaseBeatDto,
  ) {
    // Check if beat exists
    const beat = await this.prisma.beat.findUnique({
      where: { id: beatId },
    });

    if (!beat) {
      throw new NotFoundException('Beat not found');
    }

    // Check if already purchased
    const existingPurchase = await this.prisma.beatPurchase.findUnique({
      where: {
        beatId_userId: {
          beatId,
          userId,
        },
      },
    });

    if (existingPurchase) {
      throw new BadRequestException('You have already purchased this beat');
    }

    // TODO: Validate Apple receipt
    // For MVP, we'll just save the receipt
    // In production, you must validate with Apple's servers
    // const isValid = await this.validateAppleReceipt(purchaseDto.receipt);
    // if (!isValid) {
    //   throw new BadRequestException('Invalid receipt');
    // }

    // Calculate revenue splits
    const grossAmount = beat.price; // Total amount in cents
    const appleFee = Math.round(grossAmount * 0.30); // Apple's 30% cut
    const remaining = grossAmount - appleFee; // What's left after Apple
    const platformFee = Math.round(remaining * 0.30); // C705's 30% of remaining
    const producerEarning = remaining - platformFee; // Producer's 70% of remaining

    // Create purchase record with revenue tracking
    const purchase = await this.prisma.beatPurchase.create({
      data: {
        beatId,
        userId,
        receipt: purchaseDto.receipt,
        grossAmount,
        appleFee,
        platformFee,
        producerEarning,
        payoutStatus: 'pending',
      },
      include: {
        beat: true,
      },
    });

    return purchase;
  }

  /**
   * Get user's purchased beats
   */
  async getPurchasedBeats(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      this.prisma.beatPurchase.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          beat: {
            include: {
              producer: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.beatPurchase.count({ where: { userId } }),
    ]);

    return {
      beats: purchases.map((p) => p.beat),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Report a beat
   */
  async reportBeat(beatId: string, userId: string, reportDto: ReportBeatDto) {
    const beat = await this.prisma.beat.findUnique({
      where: { id: beatId },
    });

    if (!beat) {
      throw new NotFoundException('Beat not found');
    }

    // Check if already reported
    const existingReport = await this.prisma.beatReport.findFirst({
      where: {
        beatId,
        userId,
      },
    });

    if (existingReport) {
      throw new BadRequestException('You have already reported this beat');
    }

    const report = await this.prisma.beatReport.create({
      data: {
        beatId,
        userId,
        reason: reportDto.reason,
      },
    });

    return report;
  }

  /**
   * Get preview URL (always public)
   */
  async getPreviewUrl(beatId: string): Promise<string> {
    const beat = await this.prisma.beat.findUnique({
      where: { id: beatId },
      select: { previewUrl: true },
    });

    if (!beat) {
      throw new NotFoundException('Beat not found');
    }

    return beat.previewUrl;
  }

  /**
   * Get full beat URL (only if purchased)
   */
  async getFullBeatUrl(beatId: string, userId: string): Promise<string> {
    const purchase = await this.prisma.beatPurchase.findUnique({
      where: {
        beatId_userId: {
          beatId,
          userId,
        },
      },
      include: {
        beat: {
          select: { fullUrl: true },
        },
      },
    });

    if (!purchase) {
      throw new ForbiddenException('You must purchase this beat to access the full version');
    }

    return purchase.beat.fullUrl;
  }
}

