"""
Seed2Market - AI Plant Health & Disease Classification Architecture
Transfer Learning using MobileNetV3 / ResNet backbone
Includes out-of-distribution uncertainty detection
"""

import os
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def get_class_names():
    classes_file = BASE_DIR / "classes.json"
    if not classes_file.exists():
        return []
    with open(classes_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    names = [c["id"] for c in data["classes"]]
    names.append("Background_or_Unknown")
    return sorted(names)

def build_model(num_classes: int, pretrained: bool = True):
    import torch
    import torch.nn as nn
    from torchvision import models

    # MobileNetV3-Small: Lightweight, mobile-optimized, fast CPU inference
    weights = models.MobileNet_V3_Small_Weights.DEFAULT if pretrained else None
    model = models.mobilenet_v3_small(weights=weights)
    
    # Replace final linear layer
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Sequential(
        nn.Linear(in_features, 128),
        nn.Hardswish(),
        nn.Dropout(p=0.3),
        nn.Linear(128, num_classes)
    )
    return model
