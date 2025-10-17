# YOLO Format Annotations

Annotations in YOLOv8/v11 format for all tasks.

## Structure

```
yolo/
├── classification/
│   ├── data.yaml
│   └── README.md
├── detection/
│   ├── labels/ (370 files)
│   ├── data.yaml
│   └── README.md
├── segmentation/
│   ├── labels/ (370 files)
│   ├── data.yaml
│   └── README.md
├── unified/
│   ├── labels/ (370 files)
│   ├── data.yaml
│   └── README.md
└── README.md
```

## Format Specifications

### Classification
- **Format**: Folder structure (no label files needed)
- **Location**: `../../samples_classification/`
- **Classes**: 37 breeds

### Detection
- **Format**: `<class> <x_center> <y_center> <width> <height>`
- **Coordinates**: Normalized [0-1]
- **Classes**: 1 (pet)

### Segmentation
- **Format**: `<class> <x1> <y1> <x2> <y2> ... <xn> <yn>`
- **Coordinates**: Normalized polygon
- **Classes**: 1 (pet foreground)

### Unified (Recommended for Instance Segmentation)
- **Format**: `<class> <x_center> <y_center> <width> <height> <x1> <y1> ... <xn> <yn>`
- **Combines**: Detection bbox + Segmentation polygon
- **Classes**: 1 (pet)

## Which to Use?

- **Object Detection only** → `detection/`
- **Instance Segmentation** → `unified/` (best) or `segmentation/`
- **Breed Classification** → `classification/`

## Attribution

Oxford-IIIT Pet Dataset (Parkhi et al., 2012)
