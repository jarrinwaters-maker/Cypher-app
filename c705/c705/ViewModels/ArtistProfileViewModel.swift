//
//  ArtistProfileViewModel.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import Combine

@MainActor
class ArtistProfileViewModel: ObservableObject {
    @Published var artistProfile: ArtistProfile?
    @Published var tracks: [Track] = []
    @Published var isLoading = false
    @Published var isLoadingTracks = false
    @Published var errorMessage: String?
    @Published var currentPage = 1
    @Published var hasMoreTracks = true
    
    // Mutable state for follow status and count
    @Published var isFollowing: Bool = false
    @Published var followersCount: Int = 0
    
    private let apiService = APIService.shared
    private let pageSize = 20
    
    func loadArtistProfile(artistId: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let profile = try await apiService.getArtistProfile(artistId: artistId)
            artistProfile = profile
            isFollowing = profile.isFollowing ?? false
            followersCount = profile.followersCount
            // Load initial tracks
            await loadTracks(artistId: artistId, page: 1)
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func loadTracks(artistId: String, page: Int = 1) async {
        guard !isLoadingTracks else { return }
        
        isLoadingTracks = true
        
        do {
            let response = try await apiService.getArtistTracks(artistId: artistId, page: page, limit: pageSize)
            
            if page == 1 {
                tracks = response.tracks
            } else {
                tracks.append(contentsOf: response.tracks)
            }
            
            currentPage = response.pagination.page
            hasMoreTracks = response.pagination.page < response.pagination.totalPages
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoadingTracks = false
    }
    
    func loadMoreTracks(artistId: String) async {
        guard hasMoreTracks && !isLoadingTracks else { return }
        await loadTracks(artistId: artistId, page: currentPage + 1)
    }
    
    func toggleFollow(artistId: String) async {
        guard artistProfile != nil else { return }
        
        do {
            if isFollowing {
                _ = try await apiService.unfollowArtist(artistId: artistId)
                // Update local state
                isFollowing = false
                followersCount = max(0, followersCount - 1)
                AnalyticsService.shared.trackUnfollow(artistId: artistId)
            } else {
                _ = try await apiService.followArtist(artistId: artistId)
                // Update local state
                isFollowing = true
                followersCount += 1
                AnalyticsService.shared.trackFollow(artistId: artistId)
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

