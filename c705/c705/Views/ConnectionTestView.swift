//
//  ConnectionTestView.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import SwiftUI

struct ConnectionTestView: View {
    @State private var backendResult: ConnectionTestResult?
    @State private var databaseResult: ConnectionTestResult?
    @State private var isTesting = false
    @State private var customURL = ""
    @State private var showCustomURLInput = false
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Backend Configuration")) {
                    HStack {
                        Text("Base URL")
                        Spacer()
                        Text(APIService.shared.getBaseURL())
                            .font(.system(.body, design: .monospaced))
                            .foregroundColor(.secondary)
                    }
                    
                    #if !targetEnvironment(simulator)
                    Button("Set Custom URL") {
                        showCustomURLInput = true
                    }
                    #endif
                }
                
                Section(header: Text("Connection Tests")) {
                    Button(action: {
                        Task {
                            await testConnections()
                        }
                    }) {
                        HStack {
                            if isTesting {
                                ProgressView()
                                    .scaleEffect(0.8)
                            } else {
                                Image(systemName: "arrow.clockwise")
                            }
                            Text("Test Connections")
                        }
                    }
                    .disabled(isTesting)
                    
                    if let backendResult = backendResult {
                        ConnectionResultRow(
                            title: "Backend Server",
                            result: backendResult
                        )
                    }
                    
                    if let databaseResult = databaseResult {
                        ConnectionResultRow(
                            title: "Database",
                            result: databaseResult
                        )
                    }
                }
                
                Section(header: Text("Instructions")) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("For iOS Simulator:")
                            .font(.headline)
                        Text("• Uses the configured backend URL automatically")
                        Text("• Make sure backend is running")
                        
                        Text("\nFor Physical Device:")
                            .font(.headline)
                            .padding(.top, 8)
                        Text("• Default backend: http://138.197.13.98")
                        Text("• You can override it with 'Set Custom URL'")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Connection Test")
            .alert("Set Custom Backend URL", isPresented: $showCustomURLInput) {
                TextField("http://138.197.13.98", text: $customURL)
                    .keyboardType(.URL)
                    .autocapitalization(.none)
                Button("Cancel", role: .cancel) {}
                Button("Save") {
                    if !customURL.isEmpty {
                        APIService.shared.setCustomBackendURL(customURL)
                    }
                }
            } message: {
                Text("Enter a backend URL, for example http://138.197.13.98")
            }
        }
    }
    
    private func testConnections() async {
        isTesting = true
        
        // Test backend
        backendResult = await ConnectionTestService.shared.testBackendConnection()
        
        // Test database (through backend)
        databaseResult = await ConnectionTestService.shared.testDatabaseConnection()
        
        isTesting = false
    }
}

struct ConnectionResultRow: View {
    let title: String
    let result: ConnectionTestResult
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(title)
                    .font(.headline)
                Spacer()
                Image(systemName: result.success ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .foregroundColor(result.success ? .green : .red)
            }
            
            Text(result.message)
                .font(.subheadline)
                .foregroundColor(result.success ? .green : .red)
            
            Text(result.details)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    ConnectionTestView()
}

