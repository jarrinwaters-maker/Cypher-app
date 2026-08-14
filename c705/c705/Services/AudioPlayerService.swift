//
//  AudioPlayerService.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import AVFoundation
import Combine
import MediaPlayer

class AudioPlayerService: NSObject, ObservableObject {
    static let shared = AudioPlayerService()
    
    @Published var isPlaying = false
    @Published var currentTrack: Track?
    @Published var currentTime: TimeInterval = 0
    @Published var duration: TimeInterval = 0
    @Published var playbackRate: Float = 1.0
    
    private var audioPlayer: AVAudioPlayer?
    private var timer: Timer?
    private var audioSession: AVAudioSession = AVAudioSession.sharedInstance()
    
    private override init() {
        super.init()
        setupAudioSession()
        setupRemoteCommandCenter()
    }
    
    // MARK: - Audio Session Setup
    
    private func setupAudioSession() {
        do {
            try audioSession.setCategory(.playback, mode: .default, options: [.allowBluetoothA2DP])
            try audioSession.setActive(true)
        } catch {
            print("Failed to setup audio session: \(error.localizedDescription)")
        }
    }
    
    // MARK: - Remote Command Center (Lock Screen Controls)
    
    private func setupRemoteCommandCenter() {
        let commandCenter = MPRemoteCommandCenter.shared()
        
        // Play command
        commandCenter.playCommand.isEnabled = true
        commandCenter.playCommand.addTarget { [weak self] _ in
            self?.play()
            return .success
        }
        
        // Pause command
        commandCenter.pauseCommand.isEnabled = true
        commandCenter.pauseCommand.addTarget { [weak self] _ in
            self?.pause()
            return .success
        }
        
        // Toggle play/pause
        commandCenter.togglePlayPauseCommand.isEnabled = true
        commandCenter.togglePlayPauseCommand.addTarget { [weak self] _ in
            if self?.isPlaying == true {
                self?.pause()
            } else {
                self?.play()
            }
            return .success
        }
        
        // Next track (optional)
        commandCenter.nextTrackCommand.isEnabled = false
        
        // Previous track (optional)
        commandCenter.previousTrackCommand.isEnabled = false
        
        // Change playback position
        commandCenter.changePlaybackPositionCommand.isEnabled = true
        commandCenter.changePlaybackPositionCommand.addTarget { [weak self] event in
            if let event = event as? MPChangePlaybackPositionCommandEvent {
                self?.seek(to: event.positionTime)
                return .success
            }
            return .commandFailed
        }
    }
    
    // MARK: - Playback Control
    
    func loadTrack(_ track: Track) async throws {
        // Stop current playback
        stop()
        
        // Update current track
        currentTrack = track
        
        // Load audio from URL
        guard let url = URL(string: track.audioUrl) else {
            throw AudioPlayerError.invalidURL
        }
        
        // Download audio data
        let (data, _) = try await URLSession.shared.data(from: url)
        
        // Create audio player
        audioPlayer = try AVAudioPlayer(data: data)
        audioPlayer?.delegate = self
        audioPlayer?.prepareToPlay()
        
        // Update duration
        duration = audioPlayer?.duration ?? 0
        
        // Update now playing info
        updateNowPlayingInfo()
    }
    
    func play() {
        guard let player = audioPlayer else { return }
        
        do {
            try audioSession.setActive(true)
            player.play()
            isPlaying = true
            startTimer()
            updateNowPlayingInfo()
        } catch {
            print("Failed to play audio: \(error.localizedDescription)")
        }
    }
    
    func pause() {
        audioPlayer?.pause()
        isPlaying = false
        stopTimer()
        updateNowPlayingInfo()
    }
    
    func stop() {
        audioPlayer?.stop()
        audioPlayer = nil
        isPlaying = false
        currentTime = 0
        duration = 0
        stopTimer()
        currentTrack = nil
    }
    
    func seek(to time: TimeInterval) {
        guard let player = audioPlayer else { return }
        player.currentTime = time
        currentTime = time
        updateNowPlayingInfo()
    }
    
    func setPlaybackRate(_ rate: Float) {
        guard let player = audioPlayer else { return }
        player.rate = rate
        playbackRate = rate
    }
    
    // MARK: - Timer
    
    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self, let player = self.audioPlayer else { return }
            self.currentTime = player.currentTime
        }
    }
    
    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
    
    // MARK: - Now Playing Info (Lock Screen)
    
    private func updateNowPlayingInfo() {
        guard let track = currentTrack else {
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
            return
        }
        
        var nowPlayingInfo = [String: Any]()
        nowPlayingInfo[MPMediaItemPropertyTitle] = track.title
        nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
        nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = currentTime
        nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = isPlaying ? playbackRate : 0.0
        
        if let artist = track.artist {
            nowPlayingInfo[MPMediaItemPropertyArtist] = artist.user?.email ?? "Unknown Artist"
        }
        
        // Load and set artwork (optional)
        // You can add album artwork here if available
        
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
    }
}

// MARK: - AVAudioPlayerDelegate

extension AudioPlayerService: AVAudioPlayerDelegate {
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        isPlaying = false
        currentTime = 0
        stopTimer()
        updateNowPlayingInfo()
    }
    
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        print("Audio decode error: \(error?.localizedDescription ?? "Unknown error")")
        stop()
    }
    
    func audioPlayerBeginInterruption(_ player: AVAudioPlayer) {
        pause()
    }
    
    func audioPlayerEndInterruption(_ player: AVAudioPlayer, withOptions flags: Int) {
        if flags == AVAudioSession.InterruptionOptions.shouldResume.rawValue {
            play()
        }
    }
}

// MARK: - Errors

enum AudioPlayerError: LocalizedError {
    case invalidURL
    case loadFailed
    case playbackFailed
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid audio URL"
        case .loadFailed:
            return "Failed to load audio"
        case .playbackFailed:
            return "Failed to play audio"
        }
    }
}

