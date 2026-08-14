//
//  Subscription.swift
//  c705
//
//  Created for Subscription models
//

import Foundation

enum SubscriptionTier: String, Codable {
    case FREE
    case CREATOR_PLUS
    case PRO_CREATOR
}

struct SubscriptionResponse: Codable {
    let id: String?
    let userId: String?
    let tier: SubscriptionTier
    let productId: String?
    let expiresAt: String?
    let autoRenew: Bool
    let isActive: Bool
}

struct ProducerEarningsResponse: Codable {
    let pendingBalance: Int // in cents
    let totalPaid: Int // in cents
    let totalEarnings: Int // in cents
    let availableForPayout: Int // in cents
    let pendingPurchases: Int
}

struct PayoutResponse: Codable {
    let id: String
    let producerId: String
    let totalAmount: Int
    let platformFee: Int
    let netAmount: Int
    let status: String
    let createdAt: String
}

struct PayoutHistoryResponse: Codable {
    let payouts: [Payout]
    
    struct Payout: Codable, Identifiable {
        let id: String
        let producerId: String
        let totalAmount: Int
        let platformFee: Int
        let netAmount: Int
        let status: String
        let paymentMethod: String?
        let transactionId: String?
        let processedAt: String?
        let createdAt: String
    }
}

