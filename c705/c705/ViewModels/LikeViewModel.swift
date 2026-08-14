//
//  LikeViewModel.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import Combine

@MainActor
class LikeViewModel: ObservableObject {
    @Published var isLiked: Bool
    @Published var likeCount: Int
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService = APIService.shared
    private let trackId: String
    
    init(trackId: String, initialLikeCount: Int, initialIsLiked: Bool = false) {
        self.trackId = trackId
        self.likeCount = initialLikeCount
        self.isLiked = initialIsLiked
    }
    
    func toggleLike() async {
        guard !isLoading else { return }
        
        isLoading = true
        errorMessage = nil
        
        // Optimistic update
        let previousIsLiked = isLiked
        let previousCount = likeCount
        
        if isLiked {
            isLiked = false
            likeCount = max(0, likeCount - 1)
        } else {
            isLiked = true
            likeCount += 1
        }
        
        do {
            if previousIsLiked {
                // Unlike
                _ = try await apiService.unlikeTrack(trackId: trackId)
                AnalyticsService.shared.trackUnlike(trackId: trackId)
            } else {
                // Like
                _ = try await apiService.likeTrack(trackId: trackId)
                AnalyticsService.shared.trackLike(trackId: trackId)
            }
        } catch {
            // Revert on error
            isLiked = previousIsLiked
            likeCount = previousCount
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
}

