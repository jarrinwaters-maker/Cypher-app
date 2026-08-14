import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayoutsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get producer's earnings summary
   */
  async getProducerEarnings(producerId: string) {
    // Get all pending purchases
    const pendingPurchases = await this.prisma.beatPurchase.findMany({
      where: {
        beat: { producerId },
        payoutStatus: 'pending',
      },
      include: {
        beat: true,
      },
    });

    const totalPending = pendingPurchases.reduce(
      (sum, p) => sum + p.producerEarning,
      0,
    );

    // Get all paid out amounts
    const paidPayouts = await this.prisma.producerPayout.findMany({
      where: {
        producerId,
        status: 'paid',
      },
    });

    const totalPaid = paidPayouts.reduce((sum, p) => sum + p.netAmount, 0);

    // Get all-time earnings
    const allPurchases = await this.prisma.beatPurchase.findMany({
      where: {
        beat: { producerId },
      },
    });

    const totalEarnings = allPurchases.reduce(
      (sum, p) => sum + p.producerEarning,
      0,
    );

    return {
      pendingBalance: totalPending,
      totalPaid: totalPaid,
      totalEarnings: totalEarnings,
      availableForPayout: totalPending >= 5000 ? totalPending : 0, // $50 minimum
      pendingPurchases: pendingPurchases.length,
    };
  }

  /**
   * Request payout (producer)
   * Minimum $50 required
   */
  async requestPayout(producerId: string) {
    const earnings = await this.getProducerEarnings(producerId);

    if (earnings.availableForPayout < 5000) {
      throw new BadRequestException(
        `Minimum payout is $50. You have $${(earnings.pendingBalance / 100).toFixed(2)} pending.`,
      );
    }

    // Get all pending purchases
    const pendingPurchases = await this.prisma.beatPurchase.findMany({
      where: {
        beat: { producerId },
        payoutStatus: 'pending',
      },
    });

    const totalAmount = pendingPurchases.reduce(
      (sum, p) => sum + p.producerEarning,
      0,
    );
    const platformFee = pendingPurchases.reduce(
      (sum, p) => sum + p.platformFee,
      0,
    );
    const netAmount = totalAmount; // Producer gets their 70% cut

    // Create payout record
    const payout = await this.prisma.producerPayout.create({
      data: {
        producerId,
        totalAmount,
        platformFee,
        netAmount,
        status: 'pending',
      },
    });

    // Mark purchases as processing
    await this.prisma.beatPurchase.updateMany({
      where: {
        beat: { producerId },
        payoutStatus: 'pending',
      },
      data: {
        payoutStatus: 'processing',
      },
    });

    return payout;
  }

  /**
   * Get payout history
   */
  async getPayoutHistory(producerId: string) {
    return this.prisma.producerPayout.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin: Process payout
   */
  async processPayout(payoutId: string, transactionId: string) {
    const payout = await this.prisma.producerPayout.findUnique({
      where: { id: payoutId },
    });

    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    if (payout.status !== 'pending') {
      throw new BadRequestException('Payout already processed');
    }

    return this.prisma.producerPayout.update({
      where: { id: payoutId },
      data: {
        status: 'paid',
        transactionId,
        processedAt: new Date(),
      },
    });
  }
}

