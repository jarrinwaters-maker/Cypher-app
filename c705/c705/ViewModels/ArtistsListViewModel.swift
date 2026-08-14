//
//  ArtistsListViewModel.swift
//  c705
//
//  Created for Artists list
//

import Foundation
import Combine

@MainActor
class ArtistsListViewModel: ObservableObject {
    @Published var artists: [ArtistSummary] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService = APIService.shared
    private var currentPage = 1
    private let pageLimit = 20
    private var hasMorePages = true
    private var currentSearchQuery = ""
    
    func loadArtists() async {
        guard !isLoading && hasMorePages else { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await apiService.getAllArtists(
                page: currentPage,
                limit: pageLimit,
                search: currentSearchQuery.isEmpty ? nil : currentSearchQuery
            )
            
            if currentPage == 1 {
                artists = response.artists
            } else {
                artists.append(contentsOf: response.artists)
            }
            
            hasMorePages = currentPage < response.totalPages
            currentPage += 1
        } catch {
            errorMessage = "Failed to load artists: \(error.localizedDescription)"
            print("Error loading artists: \(error)")
        }
        
        isLoading = false
    }
    
    func searchArtists(query: String) {
        currentSearchQuery = query
        currentPage = 1
        hasMorePages = true
        artists = []
        Task {
            await loadArtists()
        }
    }
}

