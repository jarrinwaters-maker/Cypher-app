//
//  AudioRecorderService.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import AVFoundation
import Combine

class AudioRecorderService: NSObject, ObservableObject {
    static let shared = AudioRecorderService()
    
    @Published var isRecording = false
    @Published var recordingTime: TimeInterval = 0
    @Published var hasPermission = false
    
    private var audioRecorder: AVAudioRecorder?
    private var recordingTimer: Timer?
    private var audioSession: AVAudioSession = AVAudioSession.sharedInstance()
    
    // Maximum recording length in seconds (60 seconds for cyphers)
    let maxRecordingLength: TimeInterval = 60.0
    
    private override init() {
        super.init()
        checkPermission()
    }
    
    // MARK: - Permission Check
    
    func checkPermission() {
        if #available(iOS 17.0, *) {
            hasPermission = AVAudioApplication.shared.recordPermission == .granted
        } else {
            let status = audioSession.recordPermission
            hasPermission = status == .granted
        }
    }
    
    func requestPermission() async -> Bool {
        if #available(iOS 17.0, *) {
            return await AVAudioApplication.requestRecordPermission()
        } else {
            return await withCheckedContinuation { continuation in
                audioSession.requestRecordPermission { granted in
                    DispatchQueue.main.async {
                        self.hasPermission = granted
                        continuation.resume(returning: granted)
                    }
                }
            }
        }
    }
    
    // MARK: - Recording
    
    func startRecording() throws {
        guard hasPermission else {
            throw AudioRecorderError.permissionDenied
        }
        
        // Configure audio session for recording
        try audioSession.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker])
        try audioSession.setActive(true)
        
        // Get documents directory
        let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let audioFilename = documentsPath.appendingPathComponent("cypher-recording-\(Date().timeIntervalSince1970).m4a")
        
        // Audio settings for AAC compression
        let settings: [String: Any] = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 44100.0,
            AVNumberOfChannelsKey: 2,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue,
        ]
        
        // Create recorder
        audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
        audioRecorder?.delegate = self
        audioRecorder?.record()
        
        isRecording = true
        recordingTime = 0
        
        // Start timer
        recordingTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.recordingTime += 0.1
            
            // Auto-stop at max length
            if self.recordingTime >= self.maxRecordingLength {
                self.stopRecording()
            }
        }
    }
    
    @discardableResult
    func stopRecording() -> URL? {
        guard let recorder = audioRecorder, isRecording else {
            return nil
        }
        
        recorder.stop()
        isRecording = false
        recordingTimer?.invalidate()
        recordingTimer = nil
        
        let audioURL = recorder.url
        
        // Deactivate audio session
        try? audioSession.setActive(false)
        
        audioRecorder = nil
        
        return audioURL
    }
    
    func cancelRecording() {
        guard let recorder = audioRecorder, isRecording else {
            return
        }
        
        recorder.stop()
        isRecording = false
        recordingTimer?.invalidate()
        recordingTimer = nil
        
        // Delete the file
        try? FileManager.default.removeItem(at: recorder.url)
        
        // Deactivate audio session
        try? audioSession.setActive(false)
        
        audioRecorder = nil
    }
    
    // MARK: - Get Recording Data
    
    func getRecordingData() -> Data? {
        guard let recorder = audioRecorder, !isRecording else {
            return nil
        }
        
        return try? Data(contentsOf: recorder.url)
    }
    
    func getRecordingURL() -> URL? {
        guard let recorder = audioRecorder, !isRecording else {
            return nil
        }
        
        return recorder.url
    }
}

// MARK: - AVAudioRecorderDelegate

extension AudioRecorderService: AVAudioRecorderDelegate {
    func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
        if !flag {
            print("Recording finished unsuccessfully")
        }
    }
    
    func audioRecorderEncodeErrorDidOccur(_ recorder: AVAudioRecorder, error: Error?) {
        if let error = error {
            print("Recording error: \(error.localizedDescription)")
        }
    }
}

// MARK: - Errors

enum AudioRecorderError: LocalizedError {
    case permissionDenied
    case recordingFailed
    case fileNotFound
    
    var errorDescription: String? {
        switch self {
        case .permissionDenied:
            return "Microphone permission is required to record audio"
        case .recordingFailed:
            return "Failed to start recording"
        case .fileNotFound:
            return "Recording file not found"
        }
    }
}

