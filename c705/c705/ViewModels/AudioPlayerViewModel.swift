//
//  AudioPlayerViewModel.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import Combine

@MainActor
class AudioPlayerViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let audioPlayer = AudioPlayerService.shared
    private var cancellables = Set<AnyCancellable>()
    
    var isPlaying: Bool {
        audioPlayer.isPlaying
    }
    
    var currentTrack: Track? {
        audioPlayer.currentTrack
    }
    
    var currentTime: TimeInterval {
        audioPlayer.currentTime
    }
    
    var duration: TimeInterval {
        audioPlayer.duration
    }
    
    var progress: Double {
        guard duration > 0 else { return 0 }
        return currentTime / duration
    }
    
    var formattedCurrentTime: String {
        formatTime(currentTime)
    }
    
    var formattedDuration: String {
        formatTime(duration)
    }
    
    init() {
        // Observe audio player changes
        audioPlayer.$isPlaying
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.objectWillChange.send()
            }
            .store(in: &cancellables)
        
        audioPlayer.$currentTime
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.objectWillChange.send()
            }
            .store(in: &cancellables)
        
        audioPlayer.$currentTrack
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.objectWillChange.send()
            }
            .store(in: &cancellables)
    }
    
    func playTrack(_ track: Track) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await audioPlayer.loadTrack(track)
            audioPlayer.play()
            AnalyticsService.shared.trackTrackPlay(trackId: track.id)
        } catch {
            errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func play() {
        audioPlayer.play()
    }
    
    func pause() {
        audioPlayer.pause()
    }
    
    func stop() {
        audioPlayer.stop()
    }
    
    func seek(to time: TimeInterval) {
        audioPlayer.seek(to: time)
    }
    
    func seekToProgress(_ progress: Double) {
        let time = duration * progress
        seek(to: time)
    }
    
    private func formatTime(_ time: TimeInterval) -> String {
        let minutes = Int(time) / 60
        let seconds = Int(time) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}

