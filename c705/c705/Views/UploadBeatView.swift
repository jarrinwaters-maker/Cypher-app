//
//  UploadBeatView.swift
//  c705
//
//  Created for Beat upload functionality
//

import SwiftUI
import UniformTypeIdentifiers

struct UploadBeatView: View {
    @ObservedObject var viewModel: BeatsHubViewModel
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authService: AuthService
    
    @State private var title = ""
    @State private var selectedGenre = "Hip-Hop"
    @State private var bpm = 120 // Default BPM, no longer user-editable
    @State private var selectedMood: String? = nil
    @State private var priceText = "9.99" // Price as text input
    @State private var selectedFile: URL? = nil
    @State private var fileName = ""
    @State private var isUploading = false
    @State private var errorMessage: String?
    @State private var showError = false
    @State private var showFilePicker = false
    @State private var showSuccess = false
    
    /// Only Producer and Admin can sell beats (set price). Others upload for cyphers only.
    private var canSellBeats: Bool {
        let role = authService.currentUser?.role ?? ""
        return role == "PRODUCER" || role == "ADMIN"
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Beat Information")) {
                    TextField("Beat Title", text: $title)
                    
                    Picker("Genre", selection: $selectedGenre) {
                        ForEach(viewModel.genres, id: \.self) { genre in
                            Text(genre).tag(genre)
                        }
                    }
                    
                    Picker("Mood (Optional)", selection: $selectedMood) {
                        Text("None").tag(nil as String?)
                        ForEach(viewModel.moods, id: \.self) { mood in
                            Text(mood).tag(mood as String?)
                        }
                    }
                }
                
                if canSellBeats {
                    Section(header: Text("Pricing")) {
                        HStack {
                            Text("$")
                                .foregroundColor(.gray)
                            TextField("0.00", text: $priceText)
                                .keyboardType(.decimalPad)
                        }
                        Text("Minimum: $0.99 | Maximum: $99.99")
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                    }
                } else {
                    Section(header: Text("Upload for Cyphers")) {
                        Text("This beat will be available for use in cyphers only (not for sale).")
                            .font(.system(size: 14))
                            .foregroundColor(.secondary)
                    }
                }
                
                Section(header: Text("Audio File")) {
                    if selectedFile != nil {
                        HStack {
                            Image(systemName: "music.note")
                                .foregroundColor(.blue)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(fileName)
                                    .font(.system(size: 14, weight: .medium))
                                Text("Tap to change")
                                    .font(.system(size: 12))
                                    .foregroundColor(.gray)
                            }
                            Spacer()
                            Button(action: {
                                selectedFile = nil
                                fileName = ""
                            }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.red)
                            }
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                            showFilePicker = true
                        }
                    } else {
                        Button(action: {
                            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                            showFilePicker = true
                        }) {
                            HStack {
                                Image(systemName: "folder")
                                Text("Select Audio File")
                            }
                        }
                    }
                }
                
                Section {
                    Button(action: {
                        Task {
                            await uploadBeat()
                        }
                    }) {
                        HStack {
                            Spacer()
                            if isUploading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Text("Upload Beat")
                                    .font(.system(size: 16, weight: .bold))
                            }
                            Spacer()
                        }
                    }
                    .disabled(title.isEmpty || selectedFile == nil || isUploading)
                }
            }
            .navigationTitle("Upload Beat")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .fileImporter(
                isPresented: $showFilePicker,
                allowedContentTypes: [
                    .audio,
                    UTType.mpeg4Audio,
                    UTType(filenameExtension: "mp3") ?? UTType.audio,
                    UTType(filenameExtension: "m4a") ?? UTType.mpeg4Audio,
                    UTType(filenameExtension: "wav") ?? UTType.audio
                ],
                allowsMultipleSelection: false
            ) { result in
                switch result {
                case .success(let urls):
                    if let url = urls.first {
                        selectedFile = url
                        fileName = url.lastPathComponent
                    }
                case .failure(let error):
                    errorMessage = "Failed to select file: \(error.localizedDescription)"
                    showError = true
                }
            }
            .alert("Error", isPresented: $showError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage ?? "An error occurred")
            }
            .alert("Success", isPresented: $showSuccess) {
                Button("OK") {
                    dismiss()
                }
            } message: {
                Text("Beat uploaded successfully!")
            }
        }
    }
    
    private func parsePrice() -> Int? {
        // Remove any dollar signs or whitespace
        let cleaned = priceText.trimmingCharacters(in: .whitespaces).replacingOccurrences(of: "$", with: "")
        
        // Parse as double
        guard let dollars = Double(cleaned) else {
            return nil
        }
        
        // Validate range
        guard dollars >= 0.99 && dollars <= 99.99 else {
            return nil
        }
        
        // Convert to cents
        return Int(dollars * 100)
    }
    
    private func uploadBeat() async {
        guard let fileURL = selectedFile else {
            await MainActor.run {
                UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                errorMessage = "Please select an audio file"
                showError = true
            }
            return
        }
        
        guard !title.isEmpty else {
            await MainActor.run {
                UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                errorMessage = "Please enter a beat title"
                showError = true
            }
            return
        }
        
        let price: Int
        if canSellBeats {
            guard let p = parsePrice() else {
                await MainActor.run {
                    UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                    errorMessage = "Please enter a valid price between $0.99 and $99.99"
                    showError = true
                }
                return
            }
            price = p
        } else {
            price = 0
        }
        
        isUploading = true
        errorMessage = nil
        
        do {
            // Access security-scoped resource (required for files picked via fileImporter)
            let didStartAccess = fileURL.startAccessingSecurityScopedResource()
            defer {
                if didStartAccess {
                    fileURL.stopAccessingSecurityScopedResource()
                }
            }
            // Read audio file data
            let audioData = try Data(contentsOf: fileURL)
            
            // Upload beat
            let _ = try await APIService.shared.uploadBeat(
                title: title,
                genre: selectedGenre,
                bpm: bpm,
                mood: selectedMood,
                price: price,
                audioData: audioData,
                fileName: fileName
            )
            
            // Refresh beats list
            await viewModel.refreshBeats()
            
            // Show success and dismiss (dismiss keyboard before alert to reduce RTI/snapshot issues)
            await MainActor.run {
                UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                showSuccess = true
            }
        } catch {
            await MainActor.run {
                UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                errorMessage = "Failed to upload beat: \(error.localizedDescription)"
                showError = true
            }
        }
        
        isUploading = false
    }
}

