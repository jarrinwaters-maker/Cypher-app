//
//  Item.swift
//  c705
//
//  Created by Avery Harris on 12/22/25.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
