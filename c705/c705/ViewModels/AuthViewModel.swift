//
//  AuthViewModel.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import Combine

@MainActor
class AuthViewModel: ObservableObject {
    @Published var username = ""
    @Published var email = ""
    @Published var password = ""
    @Published var confirmPassword = ""
    @Published var selectedRole = "ARTIST"
    @Published var isSignupMode = false
    @Published var isLoading = false
    @Published var showEmailLogin = false
    
    // Use the shared AuthService from environment instead of creating a new one
    var authService: AuthService?
    
    var isAuthenticated: Bool {
        authService?.isAuthenticated ?? false
    }
    
    var currentUser: AppUser? {
        authService?.currentUser
    }
    
    var errorMessage: String? {
        authService?.errorMessage
    }
    
    func login() async {
        guard let authService = authService else { return }
        isLoading = true
        await authService.login(email: email, password: password)
        isLoading = false
    }
    
    func signup(accessCode: String? = nil) async {
        guard let authService = authService else { return }
        
        guard password == confirmPassword else {
            authService.errorMessage = "Passwords do not match"
            return
        }
        
        guard !username.isEmpty else {
            authService.errorMessage = "Username is required"
            return
        }
        
        guard !email.isEmpty else {
            authService.errorMessage = "Email is required"
            return
        }
        
        guard !password.isEmpty else {
            authService.errorMessage = "Password is required"
            return
        }
        
        // If access code is provided, set role to JOURNALIST
        var role = selectedRole
        if let accessCode = accessCode, !accessCode.isEmpty {
            role = "JOURNALIST"
        }
        
        isLoading = true
        await authService.signup(username: username, email: email, password: password, role: role, accessCode: accessCode)
        isLoading = false
    }
    
    func logout() {
        authService?.logout()
        email = ""
        password = ""
        confirmPassword = ""
    }
}

