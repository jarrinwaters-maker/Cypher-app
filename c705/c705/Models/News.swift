//
//  News.swift
//  c705
//
//  Created for Hip-Hop News models
//

import Foundation

struct HipHopNewsResponse: Codable {
    let articles: [NewsArticle]
    let total: Int
}

struct NewsArticle: Codable, Identifiable {
    let id: String
    let title: String
    let summary: String
    let source: String
    let url: String
    let imageUrl: String?
    let publishedAt: String
    let author: String?
}

