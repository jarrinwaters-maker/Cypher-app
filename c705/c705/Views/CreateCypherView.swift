//
//  CreateCypherView.swift
//  c705
//
//  Created for creating cyphers with user invites and beat selection
//

import SwiftUI
import AVFoundation
import UniformTypeIdentifiers

struct CreateCypherView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authService: AuthService
    @StateObject private var recorder = AudioRecorderService.shared
    
    @State private var cypherTitle = ""
    @State private var cypherDescription = ""
    @State private var selectedBeat: ProfileBeat?
    @State private var selectedUser: SearchUser?
    @State private var searchUsername = ""
    @State private var searchResults: [SearchUser] = []
    @State private var isSearching = false
    @State private var purchasedBeats: [ProfileBeat] = []
    @State private var importedBeats: [ProfileBeat] = []
    @State private var isLoadingBeats = false
    @State private var isCreating = false
    @State private var showError = false
    @State private var errorMessage = ""
    @State private var showRecordSheet = false
    @State private var recordedAudioURL: URL?
    @State private var showBeatsDropdown = false
    @State private var showFilePicker = false
    @State private var searchTask: Task<Void, Never>?
    
    private let apiService = APIService.shared
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 28) {
                    // Title Input
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Cypher Title")
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.primary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        TextField("Enter cypher title", text: $cypherTitle)
                            .textFieldStyle(ModernTextFieldStyle())
                    }
                    .padding(.horizontal, 20)
                    
                    // Description Input
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Description (Optional)")
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.primary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        TextField("Enter description", text: $cypherDescription, axis: .vertical)
                            .textFieldStyle(ModernTextFieldStyle())
                            .lineLimit(3...6)
                    }
                    .padding(.horizontal, 20)
                    
                    // User Search Section
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Invite User")
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.primary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        
                        VStack(alignment: .leading, spacing: 0) {
                            HStack(spacing: 12) {
                                TextField("Search by username", text: $searchUsername)
                                    .textFieldStyle(ModernTextFieldStyle())
                                    .onChange(of: searchUsername) { oldValue, newValue in
                                        // Cancel previous search task
                                        searchTask?.cancel()
                                        
                                        // Clear results if search is too short
                                        if newValue.count < 2 {
                                            searchResults = []
                                            selectedUser = nil
                                            isSearching = false
                                            return
                                        }
                                        
                                        if !newValue.isEmpty {
                                            // Debounce search by 500ms to reduce API calls
                                            searchTask = Task {
                                                try? await Task.sleep(nanoseconds: 500_000_000) // 500ms
                                                if !Task.isCancelled && searchUsername == newValue {
                                                    await MainActor.run {
                                                        searchUsers()
                                                    }
                                                }
                                            }
                                        } else {
                                            searchResults = []
                                            selectedUser = nil
                                            isSearching = false
                                        }
                                    }
                                
                                if isSearching {
                                    ProgressView()
                                        .padding(.trailing, 4)
                                }
                                
                                if selectedUser != nil {
                                    Button(action: {
                                        selectedUser = nil
                                        searchUsername = ""
                                    }) {
                                        Image(systemName: "xmark.circle.fill")
                                            .foregroundColor(.gray)
                                            .font(.system(size: 20))
                                    }
                                }
                            }
                            
                            // Dropdown overlay that overlaps content below
                            if !searchResults.isEmpty && selectedUser == nil && !searchUsername.isEmpty {
                                VStack(spacing: 0) {
                                    ScrollView {
                                        VStack(spacing: 0) {
                                            ForEach(searchResults) { user in
                                                Button(action: {
                                                    selectedUser = user
                                                    searchUsername = user.username ?? user.email
                                                    searchResults = []
                                                }) {
                                                    HStack(spacing: 12) {
                                                        // Avatar placeholder
                                                        Circle()
                                                            .fill(Color.blue.opacity(0.2))
                                                            .frame(width: 40, height: 40)
                                                            .overlay(
                                                                Text(String((user.username ?? user.email).prefix(1)).uppercased())
                                                                    .font(.system(size: 16, weight: .semibold))
                                                                    .foregroundColor(.blue)
                                                            )
                                                        
                                                        VStack(alignment: .leading, spacing: 4) {
                                                            Text(user.username ?? user.email)
                                                                .font(.system(size: 16, weight: .medium))
                                                                .foregroundColor(.primary)
                                                            Text(user.email)
                                                                .font(.system(size: 14))
                                                                .foregroundColor(.secondary)
                                                        }
                                                        
                                                        Spacer()
                                                        
                                                        // Role badge
                                                        Text(user.role.capitalized)
                                                            .font(.system(size: 12, weight: .medium))
                                                            .foregroundColor(.secondary)
                                                            .padding(.horizontal, 8)
                                                            .padding(.vertical, 4)
                                                            .background(Color(.tertiarySystemBackground))
                                                            .cornerRadius(8)
                                                    }
                                                    .padding(.horizontal, 16)
                                                    .padding(.vertical, 12)
                                                    .background(Color(.systemBackground))
                                                }
                                                .buttonStyle(PlainButtonStyle())
                                                
                                                if user.id != searchResults.last?.id {
                                                    Divider()
                                                        .padding(.leading, 68)
                                                }
                                            }
                                        }
                                    }
                                    .frame(maxHeight: 300)
                                }
                                .background(Color(.systemBackground))
                                .cornerRadius(12)
                                .shadow(color: Color.black.opacity(0.15), radius: 12, x: 0, y: 4)
                                .padding(.top, 8)
                                .overlay(
                                    // This ensures the dropdown appears above other content
                                    Color.clear
                                        .contentShape(Rectangle())
                                )
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .zIndex(selectedUser == nil && !searchResults.isEmpty ? 1 : 0)
                    
                    // Beat Selection Section
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Select Beat")
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(.primary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        
                        // Beat Selection Buttons
                        HStack(spacing: 12) {
                            Button(action: {
                                withAnimation {
                                    showBeatsDropdown.toggle()
                                }
                            }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "plus.circle.fill")
                                        .font(.system(size: 16))
                                    Text("from beats")
                                        .font(.system(size: 16, weight: .medium))
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.blue)
                                .cornerRadius(12)
                            }
                            
                            Button(action: {
                                showFilePicker = true
                            }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "plus.circle.fill")
                                        .font(.system(size: 16))
                                    Text("from phone")
                                        .font(.system(size: 16, weight: .medium))
                                }
                                .foregroundColor(.blue)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.blue.opacity(0.1))
                                .cornerRadius(12)
                            }
                        }
                        
                        // Beats Dropdown
                        if showBeatsDropdown {
                            VStack(spacing: 0) {
                                if isLoadingBeats {
                                    ProgressView("Loading beats...")
                                        .frame(maxWidth: .infinity)
                                        .padding()
                                } else if allBeats.isEmpty {
                                    Text("No beats available")
                                        .font(.system(size: 14))
                                        .foregroundColor(.secondary)
                                        .frame(maxWidth: .infinity)
                                        .padding()
                                } else {
                                    ScrollView {
                                        VStack(spacing: 0) {
                                            ForEach(allBeats) { beat in
                                                Button(action: {
                                                    selectedBeat = beat
                                                    showBeatsDropdown = false
                                                }) {
                                                    HStack {
                                                        VStack(alignment: .leading, spacing: 4) {
                                                            Text(beat.title)
                                                                .font(.system(size: 16, weight: .medium))
                                                                .foregroundColor(.primary)
                                                            if beat.isPurchased {
                                                                Text("Purchased")
                                                                    .font(.system(size: 12))
                                                                    .foregroundColor(.green)
                                                            } else if beat.isImported {
                                                                Text("Imported")
                                                                    .font(.system(size: 12))
                                                                    .foregroundColor(.blue)
                                                            }
                                                        }
                                                        Spacer()
                                                        if selectedBeat?.id == beat.id {
                                                            Image(systemName: "checkmark.circle.fill")
                                                                .foregroundColor(.blue)
                                                                .font(.system(size: 20))
                                                        }
                                                    }
                                                    .padding(.horizontal, 16)
                                                    .padding(.vertical, 12)
                                                    .background(selectedBeat?.id == beat.id ? Color.blue.opacity(0.05) : Color.clear)
                                                }
                                                .buttonStyle(PlainButtonStyle())
                                                
                                                if beat.id != allBeats.last?.id {
                                                    Divider()
                                                        .padding(.leading, 16)
                                                }
                                            }
                                        }
                                    }
                                    .frame(maxHeight: 300)
                                }
                            }
                            .background(Color(.systemBackground))
                            .cornerRadius(12)
                            .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
                            .padding(.top, 8)
                        }
                        
                        // Selected Beat Display
                        if let selectedBeat = selectedBeat {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(selectedBeat.title)
                                        .font(.system(size: 16, weight: .medium))
                                        .foregroundColor(.primary)
                                    if selectedBeat.isPurchased {
                                        Text("Purchased")
                                            .font(.system(size: 12))
                                            .foregroundColor(.green)
                                    } else if selectedBeat.isImported {
                                        Text("Imported")
                                            .font(.system(size: 12))
                                            .foregroundColor(.blue)
                                    }
                                }
                                Spacer()
                                Button(action: {
                                    self.selectedBeat = nil
                                }) {
                                    Text("Remove")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundColor(.red)
                                }
                            }
                            .padding(16)
                            .background(Color(.secondarySystemBackground))
                            .cornerRadius(12)
                            .padding(.top, 8)
                            
                            // Record Button
                            Button(action: {
                                showRecordSheet = true
                            }) {
                                HStack {
                                    Image(systemName: "mic.fill")
                                    Text("Record Over Beat")
                                }
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.blue)
                                .cornerRadius(12)
                            }
                            .padding(.top, 8)
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    // Create Button
                    Button(action: {
                        Task {
                            await createCypher()
                        }
                    }) {
                        HStack {
                            if isCreating {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Text("Create Cypher")
                                    .font(.system(size: 17, weight: .semibold))
                            }
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(canCreate ? Color.blue : Color.gray)
                        .cornerRadius(12)
                    }
                    .disabled(!canCreate || isCreating)
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                }
                .padding(.vertical, 20)
            }
            .navigationTitle("Create Cypher")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .alert("Error", isPresented: $showError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage)
            }
            .sheet(isPresented: $showRecordSheet) {
                if let beat = selectedBeat {
                    RecordOverBeatView(
                        beat: beat,
                        onRecordingComplete: { url in
                            recordedAudioURL = url
                            showRecordSheet = false
                        }
                    )
                }
            }
            .fileImporter(
                isPresented: $showFilePicker,
                allowedContentTypes: [UTType.audio, UTType.mp3, UTType.mpeg4Audio],
                allowsMultipleSelection: false
            ) { result in
                switch result {
                case .success(let urls):
                    if let url = urls.first {
                        handleImportedFile(url: url)
                    }
                case .failure(let error):
                    errorMessage = "Failed to import file: \(error.localizedDescription)"
                    showError = true
                }
            }
            .task {
                await loadBeats()
            }
        }
    }
    
    private var allBeats: [ProfileBeat] {
        purchasedBeats + importedBeats
    }
    
    private var canCreate: Bool {
        !cypherTitle.isEmpty && selectedBeat != nil
    }
    
    private func loadBeats() async {
        isLoadingBeats = true
        
        do {
            // Load purchased beats
            let response = try await apiService.getPurchasedBeats()
            await MainActor.run {
                purchasedBeats = response.beats.map { apiBeat in
                    ProfileBeat(from: apiBeat, isPurchased: true)
                }
            }
            
            // Load imported beats from UserDefaults
            if let importedData = UserDefaults.standard.data(forKey: "importedBeats"),
               let decoded = try? JSONDecoder().decode([ProfileBeat].self, from: importedData) {
                await MainActor.run {
                    importedBeats = decoded
                }
            }
        } catch {
            print("Error loading beats: \(error)")
        }
        
        await MainActor.run {
            isLoadingBeats = false
        }
    }
    
    private func searchUsers() {
        // Require at least 2 characters
        guard searchUsername.count >= 2 else {
            searchResults = []
            isSearching = false
            return
        }
        
        isSearching = true
        
        Task {
            do {
                let users = try await apiService.searchUsersByUsername(searchUsername)
                await MainActor.run {
                    // Only update if the search text hasn't changed and we're still searching
                    if !searchUsername.isEmpty && searchUsername.count >= 2 {
                        searchResults = users
                    } else {
                        searchResults = []
                    }
                    isSearching = false
                }
            } catch {
                await MainActor.run {
                    // Silently handle errors - don't show error messages for search failures
                    print("Search error: \(error.localizedDescription)")
                    searchResults = []
                    isSearching = false
                }
            }
        }
    }
    
    private func handleImportedFile(url: URL) {
        // Start accessing the security-scoped resource
        guard url.startAccessingSecurityScopedResource() else {
            errorMessage = "Failed to access file"
            showError = true
            return
        }
        
        defer {
            url.stopAccessingSecurityScopedResource()
        }
        
        // Get file name
        let fileName = url.lastPathComponent
        
        // Create a ProfileBeat from the imported file
        let importedBeat = ProfileBeat(
            title: fileName.replacingOccurrences(of: ".\(url.pathExtension)", with: ""),
            localFilePath: url.path,
            isImported: true,
            importDate: Date()
        )
        
        // Add to imported beats
        importedBeats.append(importedBeat)
        
        // Save to UserDefaults
        if let encoded = try? JSONEncoder().encode(importedBeats) {
            UserDefaults.standard.set(encoded, forKey: "importedBeats")
        }
        
        // Select the newly imported beat
        selectedBeat = importedBeat
    }
    
    private func createCypher() async {
        guard let beat = selectedBeat else { return }
        
        isCreating = true
        
        do {
            // Get beat URL (either from purchased beat or local file)
            var beatUrl: String?
            
            if beat.isPurchased, let audioUrl = beat.audioUrl {
                beatUrl = audioUrl
            } else if beat.isImported, let _ = beat.localFilePath {
                // For imported beats, we'd need to upload them first
                // For now, we'll use the purchased beat URL if available
                beatUrl = nil
            }
            
            // Create cypher with INVITE_ONLY visibility
            // Note: The backend uses cypherType, but we need to set visibility to INVITE_ONLY
            // For now, we'll use BEAT_LOCKED as the type and the backend should handle visibility
            let cypher = try await apiService.createCypher(
                title: cypherTitle,
                description: cypherDescription.isEmpty ? nil : cypherDescription,
                beatUrl: beatUrl,
                cypherType: "BEAT_LOCKED", // Type is BEAT_LOCKED, visibility will be set to INVITE_ONLY by backend
                startDate: Date(),
                endDate: nil
            )
            
            // If user is selected, invite them
            if let user = selectedUser {
                do {
                    try await apiService.inviteArtistToCypher(cypherId: cypher.id, artistId: user.id)
                } catch {
                    print("Failed to invite user: \(error)")
                    // Continue even if invite fails
                }
            }
            
            // If we recorded audio, submit it as an entry
            if let audioURL = recordedAudioURL, let audioData = try? Data(contentsOf: audioURL) {
                do {
                    let fileName = "cypher-entry-\(Date().timeIntervalSince1970).m4a"
                    _ = try await apiService.submitCypherEntry(
                        cypherId: cypher.id,
                        audioData: audioData,
                        fileName: fileName,
                        title: nil
                    )
                } catch {
                    print("Failed to submit entry: \(error)")
                    // Continue even if entry submission fails
                }
            }
            
            await MainActor.run {
                isCreating = false
                dismiss()
            }
        } catch {
            await MainActor.run {
                isCreating = false
                errorMessage = "Failed to create cypher: \(error.localizedDescription)"
                showError = true
            }
        }
    }
}

// MARK: - Modern Text Field Style (ViewModifier to avoid "visual style disabled" warnings)
struct ModernTextFieldModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color(.secondarySystemBackground))
            .cornerRadius(12)
            .font(.system(size: 17))
    }
}

struct ModernTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .modifier(ModernTextFieldModifier())
    }
}

// MARK: - Search User Model (moved to separate file for reuse)

// MARK: - Record Over Beat View
struct RecordOverBeatView: View {
    let beat: ProfileBeat
    let onRecordingComplete: (URL) -> Void
    @Environment(\.dismiss) var dismiss
    @StateObject private var recorder = AudioRecorderService.shared
    @State private var isUploading = false
    @State private var showError = false
    @State private var errorMessage = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                Text("Record over: \(beat.title)")
                    .font(.headline)
                    .padding()
                
                // Recording Status
                VStack(spacing: 16) {
                    if recorder.isRecording {
                        ZStack {
                            Circle()
                                .fill(Color.red.opacity(0.2))
                                .frame(width: 120, height: 120)
                            
                            Circle()
                                .fill(Color.red)
                                .frame(width: 100, height: 100)
                            
                            Image(systemName: "mic.fill")
                                .font(.system(size: 40))
                                .foregroundColor(.white)
                        }
                        
                        Text("Recording...")
                            .font(.headline)
                            .foregroundColor(.red)
                        
                        Text(timeString(recorder.recordingTime))
                            .font(.system(size: 32, weight: .bold))
                    } else {
                        ZStack {
                            Circle()
                                .fill(Color.blue.opacity(0.2))
                                .frame(width: 120, height: 120)
                            
                            Image(systemName: "mic.fill")
                                .font(.system(size: 50))
                                .foregroundColor(.blue)
                        }
                        
                        Text("Ready to Record")
                            .font(.headline)
                    }
                }
                .padding(.top, 40)
                
                // Controls
                HStack(spacing: 40) {
                    if recorder.isRecording {
                        Button(action: {
                            if let url = recorder.stopRecording() {
                                onRecordingComplete(url)
                            }
                        }) {
                            VStack {
                                Image(systemName: "stop.circle.fill")
                                    .font(.system(size: 50))
                                    .foregroundColor(.red)
                                Text("Stop")
                                    .font(.caption)
                            }
                        }
                    } else {
                        Button(action: {
                            do {
                                try recorder.startRecording()
                            } catch {
                                errorMessage = error.localizedDescription
                                showError = true
                            }
                        }) {
                            VStack {
                                Image(systemName: "record.circle.fill")
                                    .font(.system(size: 50))
                                    .foregroundColor(.red)
                                Text("Record")
                                    .font(.caption)
                            }
                        }
                        .disabled(!recorder.hasPermission)
                    }
                }
                
                Spacer()
            }
            .navigationTitle("Record Over Beat")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        recorder.cancelRecording()
                        dismiss()
                    }
                }
            }
            .alert("Error", isPresented: $showError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage)
            }
            .task {
                if !recorder.hasPermission {
                    let granted = await recorder.requestPermission()
                    if !granted {
                        errorMessage = "Microphone permission is required"
                        showError = true
                    }
                }
            }
        }
    }
    
    private func timeString(_ time: TimeInterval) -> String {
        let minutes = Int(time) / 60
        let seconds = Int(time) % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}
