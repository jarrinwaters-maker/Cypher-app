//
//  BeatsHubViewModel.swift
//  c705
//
//  Created for Beats feature
//

import Foundation
import Combine

@MainActor
class BeatsHubViewModel: ObservableObject {
    @Published var beats: [Beat] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var selectedGenre: String? = nil
    @Published var selectedBpm: Int? = nil
    @Published var selectedMood: String? = nil
    @Published var searchText: String = ""
    
    private let apiService = APIService.shared
    private var currentPage = 1
    private let pageLimit = 20
    private var hasMorePages = true
    
    // Available filters
    let genres = ["Hip-Hop", "Trap", "R&B", "Pop", "Drill", "Afrobeat", "Reggae", "Jazz", "Electronic", "Other"]
    let moods = ["Aggressive", "Chill", "Energetic", "Melodic", "Dark", "Upbeat", "Smooth", "Other"]
    let bpmRanges = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]
    
    func loadBeats() async {
        guard !isLoading else { return }
        guard hasMorePages else { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let response = try await apiService.getBeats(
                page: currentPage,
                limit: pageLimit,
                genre: selectedGenre,
                bpm: selectedBpm,
                mood: selectedMood
            )
            
            if currentPage == 1 {
                beats = response.beats
            } else {
                beats.append(contentsOf: response.beats)
            }
            
            hasMorePages = currentPage < response.totalPages
            currentPage += 1
        } catch let error as APIError {
            // Handle API errors with better messages
            print("❌ API Error loading beats: \(error)")
            switch error {
            case .httpError(let code):
                if code == 401 {
                    errorMessage = "Authentication required. Please sign in again."
                } else if code == 500 {
                    errorMessage = "Server error. Please try again later."
                } else {
                    errorMessage = "Failed to load beats (Error \(code)). Please try again."
                }
            case .httpErrorWithMessage(_, let message):
                errorMessage = message
            case .networkError(let message):
                errorMessage = message
            case .decodingError(let decodeError):
                print("❌ Decoding Error: \(decodeError)")
                errorMessage = "Invalid response from server. Please try again."
            case .invalidURL:
                errorMessage = "Invalid server URL. Please check your connection settings."
            case .invalidResponse:
                errorMessage = "Invalid response from server. Please try again."
            }
        } catch {
            errorMessage = "Failed to load beats: \(error.localizedDescription)"
            print("❌ Error loading beats: \(error)")
        }
        
        isLoading = false
    }
    
    func refreshBeats() async {
        currentPage = 1
        hasMorePages = true
        beats = []
        await loadBeats()
    }
    
    func applyFilters(genre: String?, bpm: Int?, mood: String?) {
        selectedGenre = genre
        selectedBpm = bpm
        selectedMood = mood
        Task {
            await refreshBeats()
        }
    }
    
    func clearFilters() {
        selectedGenre = nil
        selectedBpm = nil
        selectedMood = nil
        Task {
            await refreshBeats()
        }
    }
    
    // Filtered beats based on search text
    var filteredBeats: [Beat] {
        if searchText.isEmpty {
            return beats
        }
        
        let searchLower = searchText.lowercased()
        return beats.filter { beat in
            // Search in title
            beat.title.lowercased().contains(searchLower) ||
            // Search in genre
            beat.genre.lowercased().contains(searchLower) ||
            // Search in mood
            (beat.mood?.lowercased().contains(searchLower) ?? false) ||
            // Search in producer name
            (beat.producer?.username?.lowercased().contains(searchLower) ?? false) ||
            (beat.producer?.email.lowercased().contains(searchLower) ?? false)
        }
    }
}

