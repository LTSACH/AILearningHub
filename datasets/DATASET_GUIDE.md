# 📖 Dataset Publishing Guide

Guide for adding new datasets to the public repository.

---

## 🎯 When to Publish a Dataset

Publish datasets when:
- ✅ Small enough for GitHub (< 50MB for CSV, < 100MB absolute limit)
- ✅ Legal to share publicly
- ✅ Useful for tutorials and demos
- ✅ Clean and well-documented

**Don't publish:**
- ❌ Proprietary or copyrighted data
- ❌ Large datasets (> 50MB) - use Git LFS or external hosting
- ❌ Personal or sensitive information
- ❌ Raw, unprocessed data without documentation

---

## 📁 Directory Structure Template

```
datasets/
├── README.md                    # Catalog of all datasets
└── [dataset-name]/
    ├── README.md               # Dataset description
    ├── metadata.json           # Machine-readable metadata
    ├── data/                   # Raw data files
    │   ├── full-data.csv      # Complete dataset
    │   ├── train.csv          # Training split
    │   ├── test.csv           # Test split
    │   └── val.csv            # Validation split
    └── examples/               # (Optional) Code examples
        ├── load_data.py
        └── basic_analysis.ipynb
```

---

## 🔨 Step-by-Step: Add New Dataset

### Step 1: Prepare Data
```bash
cd /workspace/AI/AITraining/github-sync

# Create directory
mkdir -p datasets/[dataset-name]/data

# Copy clean data files
cp /path/to/data.csv datasets/[dataset-name]/data/
```

### Step 2: Create README.md
Use `datasets/bbcnews/README.md` as template. Include:
- Dataset overview (size, type, categories)
- File descriptions
- Statistics and distribution
- Usage examples (Python code)
- Download options
- License and citation

### Step 3: Create metadata.json
Use `datasets/bbcnews/metadata.json` as template. Include:
- Basic info (name, version, description)
- Statistics (size, classes, distribution)
- File information (paths, URLs, sizes)
- Data schema (column names, types)
- Benchmarks (if available)

### Step 4: Update Catalog
Edit `datasets/README.md` to add new dataset to table.

### Step 5: Test URLs
Before committing, verify file sizes:
```bash
ls -lh datasets/[dataset-name]/data/
```

Ensure no file > 100MB (GitHub limit).

### Step 6: Commit and Push
```bash
cd /workspace/AI/AITraining/github-sync

git add datasets/[dataset-name]
git commit -m "Add: [Dataset Name] dataset"
git push origin main
```

### Step 7: Verify Access
After push, test direct load:
```python
import pandas as pd
url = "https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/[dataset-name]/data/file.csv"
df = pd.read_csv(url)
```

---

## 📋 Checklist

Before publishing a dataset, ensure:

### Legal & Ethical
- [ ] Dataset is legal to share publicly
- [ ] Proper license/attribution included
- [ ] No personal or sensitive information
- [ ] No copyright violations

### Technical
- [ ] Files < 50MB (CSV/text) or < 100MB (absolute limit)
- [ ] Clean, processed data (not raw dumps)
- [ ] Consistent format (CSV, JSON, etc.)
- [ ] No corrupted or missing data

### Documentation
- [ ] README.md with description and examples
- [ ] metadata.json with complete information
- [ ] Clear column/field descriptions
- [ ] Usage examples that work
- [ ] License and citation info

### Quality
- [ ] Data is clean and validated
- [ ] Consistent naming conventions
- [ ] Pre-split if applicable (train/test/val)
- [ ] Balanced classes (or document imbalance)

---

## 🎨 Naming Conventions

### Dataset Directory Names
- Use lowercase
- Use hyphens for spaces: `bbc-news`, `animals-10`
- Be descriptive but concise
- Avoid special characters

### File Names
- Use lowercase
- Use hyphens or underscores: `train.csv`, `test-set.csv`
- Be descriptive: `bbc-news.csv` not just `data.csv`
- Include split in name: `train.csv`, `test.csv`, `val.csv`

---

## 📊 File Format Guidelines

### CSV Files (Recommended)
✅ **Use when:**
- Tabular data
- Text data
- < 50MB
- Need GitHub preview

✅ **Advantages:**
- Easy to preview on GitHub
- Direct load with pandas
- Git-friendly (track changes)
- No extraction needed

### JSON Files
✅ **Use when:**
- Nested/hierarchical data
- API responses
- Configuration data
- < 10MB

### Zip Files
❌ **Avoid unless:**
- File would be > 50MB uncompressed
- Many small files (100+)
- Binary data that doesn't compress well

❌ **Disadvantages:**
- No GitHub preview
- Extra extraction step
- Harder to use directly
- Not git-friendly

---

## 🔗 URL Structure

After publishing, your data will be accessible at:

**GitHub Tree View:**
```
https://github.com/LTSACH/AILearningHub/tree/main/datasets/[dataset-name]
```

**Raw File URLs (for direct download/load):**
```
https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/[dataset-name]/data/[file.csv]
```

**Example:**
```python
url = "https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/bbcnews/data/train.csv"
df = pd.read_csv(url)
```

---

## 🎯 Best Practices

### Do's ✅
1. **Pre-split data** - Provide train/test/val splits
2. **Document thoroughly** - Clear README and metadata
3. **Provide examples** - Working code snippets
4. **Use standard formats** - CSV, JSON for structured data
5. **Include stats** - Size, distribution, benchmarks
6. **Cite sources** - Proper attribution
7. **Test URLs** - Verify direct load works

### Don'ts ❌
1. **Don't upload large files** - Use Git LFS or external hosting
2. **Don't include personal data** - Privacy violations
3. **Don't skip documentation** - Others need to understand
4. **Don't use proprietary formats** - Stick to open formats
5. **Don't forget license** - Always specify usage terms
6. **Don't commit binary blobs** - Images, models, etc.
7. **Don't leave data dirty** - Clean before publishing

---

## 🔍 Examples of Good Datasets

### Text Classification (BBC News)
- ✅ Small CSV files (< 10MB)
- ✅ Clear categories
- ✅ Pre-split data
- ✅ Complete documentation
- ✅ Usage examples

### Image Classification (Future: Animals10 - Sample)
- ✅ Small sample set (100 images)
- ✅ Link to full dataset (external)
- ✅ Organized by category
- ✅ Metadata JSON
- ⚠️ Consider Git LFS for full set

### Tabular Data (Future)
- ✅ CSV format
- ✅ Clear column names
- ✅ Data dictionary
- ✅ Sample and full versions

---

## 🆘 Troubleshooting

### "File too large" error
**Problem:** File > 100MB  
**Solution:**
1. Use Git LFS: `git lfs track "*.csv"`
2. Or host externally (Kaggle, Google Drive, S3)
3. Or provide sample dataset + link to full

### Can't preview on GitHub
**Problem:** File format not supported  
**Solution:** Use CSV or JSON for structured data

### Direct load fails
**Problem:** URL incorrect or file not committed  
**Solution:**
1. Verify file is pushed to GitHub
2. Use "raw" URL format
3. Check file path is correct

### Slow loading
**Problem:** File too large for direct load  
**Solution:**
1. Split into smaller files
2. Provide pre-processed version
3. Use streaming/chunking in code examples

---

## 📚 Templates

Templates available:
- `datasets/README.md` - Catalog template
- `datasets/bbcnews/README.md` - Dataset README template
- `datasets/bbcnews/metadata.json` - Metadata template

Copy and modify for new datasets.

---

## 📞 Questions?

- Check existing datasets for examples
- Read GitHub's file size limits
- Open an issue if unsure about sharing a dataset

---

**Last Updated:** October 16, 2025

