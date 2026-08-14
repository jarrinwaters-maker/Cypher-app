import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionTier } from '../../../c705_db/generated/prisma/enums';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user's subscription status
   */
  async getSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      // Return default FREE tier
      return {
        tier: SubscriptionTier.FREE,
        isActive: true,
        expiresAt: null,
        autoRenew: false,
      };
    }

    const isActive =
      !subscription.expiresAt || subscription.expiresAt > new Date();

    return {
      ...subscription,
      isActive,
    };
  }

  /**
   * Create or update subscription
   * Called after successful Apple IAP purchase
   */
  async createOrUpdateSubscription(
    userId: string,
    tier: SubscriptionTier,
    productId: string,
    receipt: string,
    expiresAt?: Date,
  ) {
    const existing = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (existing) {
      return this.prisma.subscription.update({
        where: { userId },
        data: {
          tier,
          productId,
          receipt,
          expiresAt,
          autoRenew: true,
        },
      });
    }

    return this.prisma.subscription.create({
      data: {
        userId,
        tier,
        productId,
        receipt,
        expiresAt,
        autoRenew: true,
      },
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { userId },
      data: {
        autoRenew: false,
        // Keep subscription active until expiresAt
      },
    });
  }

  /**
   * Check if user has feature access
   */
  async hasFeatureAccess(
    userId: string,
    requiredTier: SubscriptionTier,
  ): Promise<boolean> {
    const subscription = await this.getSubscription(userId);

    if (!subscription.isActive) {
      return requiredTier === SubscriptionTier.FREE;
    }

    const tierHierarchy = {
      [SubscriptionTier.FREE]: 0,
      [SubscriptionTier.CREATOR_PLUS]: 1,
      [SubscriptionTier.PRO_CREATOR]: 2,
    };

    return (
      tierHierarchy[subscription.tier] >= tierHierarchy[requiredTier]
    );
  }

  /**
   * Get subscription features for a tier
   */
  getTierFeatures(tier: SubscriptionTier) {
    const features = {
      [SubscriptionTier.FREE]: [
        'Upload tracks',
        'Join cyphers',
        'Like and comment',
        'Limited beat previews',
      ],
      [SubscriptionTier.CREATOR_PLUS]: [
        'Unlimited track uploads',
        'Advanced analytics',
        'Priority cypher placement',
        'Profile customization',
        'Early feature access',
      ],
      [SubscriptionTier.PRO_CREATOR]: [
        'Everything in Creator+',
        'Beat upload priority',
        'Featured placement eligibility',
        'Higher cypher visibility',
        'Reduced platform fee (25% instead of 30%)',
      ],
    };

    return features[tier] || features[SubscriptionTier.FREE];
  }
}

