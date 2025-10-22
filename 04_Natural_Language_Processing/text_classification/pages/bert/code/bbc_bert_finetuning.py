"""
BBC News Classification with BERT Fine-tuning
=============================================

This script fine-tunes various BERT models (BERT-base, DistilBERT, TinyBERT)
with different pooling strategies (CLS, Mean, Pooler) for text classification.

Models trained: 8 configurations
- BERT-base: pooler_output, cls_token, mean_pooling
- DistilBERT: cls_token, mean_pooling (no pooler)
- TinyBERT: pooler_output, cls_token, mean_pooling

Dataset: BBC News (5 categories)
- Train: 1557 samples
- Validation: 334 samples
- Test: 334 samples
"""

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
from pathlib import Path
from tqdm import tqdm
import json
from datetime import datetime
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from transformers import (
    AutoTokenizer, AutoModel, AutoConfig,
    get_linear_schedule_with_warmup
)
from torch.optim import AdamW


# ========== Configuration ==========

BERT_MODELS = {
    'bert_base': {
        'name': 'BERT-base',
        'model_name': 'bert-base-uncased',
        'params_millions': 110,
        'has_pooler': True
    },
    'distilbert': {
        'name': 'DistilBERT',
        'model_name': 'distilbert-base-uncased',
        'params_millions': 66,
        'has_pooler': False
    },
    'tinybert': {
        'name': 'TinyBERT',
        'model_name': 'prajjwal1/bert-tiny',
        'params_millions': 14,
        'has_pooler': True
    }
}

POOLING_STRATEGIES = {
    'cls_token': '[CLS] Token',
    'mean_pooling': 'Mean Pooling',
    'pooler_output': 'Pooler Output'
}

TRAINING_CONFIG = {
    'max_length': 128,
    'batch_size': 16,
    'eval_batch_size': 32,
    'learning_rate': 2e-5,
    'num_epochs': 3,
    'weight_decay': 0.01,
    'warmup_ratio': 0.1,
    'seed': 42
}


# ========== Data Loading ==========

class BBCNewsDataset(Dataset):
    """PyTorch Dataset for BBC News"""
    
    def __init__(self, texts, labels, tokenizer, max_length=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        encoding = self.tokenizer(
            text,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'label': torch.tensor(label, dtype=torch.long)
        }


def download_bbc_news():
    """Download BBC News dataset from GitHub Pages"""
    print("="*70)
    print("📥 DOWNLOADING BBC NEWS DATASET")
    print("="*70)
    
    base_url = 'https://ltsach.github.io/AILearningHub/datasets/bbcnews/data/'
    
    try:
        train_df = pd.read_csv(base_url + 'train.csv')
        val_df = pd.read_csv(base_url + 'val.csv')
        test_df = pd.read_csv(base_url + 'test.csv')
        
        print(f"✓ Train: {len(train_df):,} samples")
        print(f"✓ Val: {len(val_df):,} samples")
        print(f"✓ Test: {len(test_df):,} samples")
        print(f"✓ Categories: {sorted(train_df['category'].unique().tolist())}")
        print()
        
        return train_df, val_df, test_df
    except Exception as e:
        print(f"❌ Failed to download: {e}")
        return None, None, None


def load_bbc_news(data_dir='data'):
    """Load BBC News dataset"""
    data_dir = Path(data_dir)
    
    # Check if data exists locally
    if not (data_dir / 'train.csv').exists():
        print("📥 Dataset not found locally, downloading...")
        train_df, val_df, test_df = download_bbc_news()
        if train_df is None:
            raise FileNotFoundError("Failed to download dataset")
        
        # Get label mapping for downloaded data
        label_map = {label: idx for idx, label in enumerate(sorted(train_df['category'].unique()))}
        
        # Convert labels
        train_df['label'] = train_df['category'].map(label_map)
        val_df['label'] = val_df['category'].map(label_map)
        test_df['label'] = test_df['category'].map(label_map)
        
        print(f"✓ Loaded BBC News dataset")
        print(f"  Train: {len(train_df)} samples")
        print(f"  Val: {len(val_df)} samples")
        print(f"  Test: {len(test_df)} samples")
        print(f"  Classes: {list(label_map.keys())}")
        
        return train_df, val_df, test_df, label_map
    
    # Load preprocessed data
    train_df = pd.read_csv(data_dir / 'train.csv')
    val_df = pd.read_csv(data_dir / 'val.csv')
    test_df = pd.read_csv(data_dir / 'test.csv')
    
    # Get label mapping
    label_map = {label: idx for idx, label in enumerate(sorted(train_df['category'].unique()))}
    
    # Convert labels
    train_df['label'] = train_df['category'].map(label_map)
    val_df['label'] = val_df['category'].map(label_map)
    test_df['label'] = test_df['category'].map(label_map)
    
    print(f"✓ Loaded BBC News dataset")
    print(f"  Train: {len(train_df)} samples")
    print(f"  Val: {len(val_df)} samples")
    print(f"  Test: {len(test_df)} samples")
    print(f"  Classes: {list(label_map.keys())}")
    
    return train_df, val_df, test_df, label_map


# ========== Model Definition ==========

class BERTWithCustomPooling(nn.Module):
    """BERT model with custom pooling strategies"""
    
    def __init__(self, model_name, pooling_strategy='cls_token', num_labels=5, dropout=0.1):
        super().__init__()
        self.pooling_strategy = pooling_strategy
        
        # Load pre-trained BERT
        config = AutoConfig.from_pretrained(model_name)
        self.bert = AutoModel.from_pretrained(model_name, config=config)
        hidden_size = config.hidden_size
        
        # Classification head
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(hidden_size, num_labels)
        
        # Check if model has pooler
        self.has_pooler = hasattr(self.bert, 'pooler') and self.bert.pooler is not None
    
    def forward(self, input_ids, attention_mask):
        # Get BERT outputs
        outputs = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask,
            return_dict=True
        )
        
        # Apply pooling strategy
        if self.pooling_strategy == 'cls_token':
            # Use [CLS] token (first token)
            pooled = outputs.last_hidden_state[:, 0, :]
        
        elif self.pooling_strategy == 'mean_pooling':
            # Average all tokens (excluding padding)
            last_hidden = outputs.last_hidden_state
            attention_mask_expanded = attention_mask.unsqueeze(-1).expand(last_hidden.size()).float()
            sum_hidden = torch.sum(last_hidden * attention_mask_expanded, dim=1)
            sum_mask = torch.clamp(attention_mask_expanded.sum(dim=1), min=1e-9)
            pooled = sum_hidden / sum_mask
        
        elif self.pooling_strategy == 'pooler_output':
            # Use BERT's pooler output (if available)
            if not self.has_pooler:
                raise ValueError(f"Model does not have pooler output")
            pooled = outputs.pooler_output
        
        else:
            raise ValueError(f"Unknown pooling strategy: {self.pooling_strategy}")
        
        # Classification
        pooled = self.dropout(pooled)
        logits = self.classifier(pooled)
        
        return logits


# ========== Training ==========

class BERTTrainer:
    """Train and evaluate BERT models"""
    
    def __init__(self, data_dir='data', output_dir='results/bert'):
        self.data_dir = Path(data_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Set device
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"\n🖥️  Device: {self.device}")
        
        # Set seed
        torch.manual_seed(TRAINING_CONFIG['seed'])
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(TRAINING_CONFIG['seed'])
    
    def train_combination(self, model_key, pooling_key, train_df, val_df, test_df, label_map):
        """Train single model + pooling combination"""
        
        model_info = BERT_MODELS[model_key]
        
        # Skip if pooling requires pooler but model doesn't have it
        if pooling_key == 'pooler_output' and not model_info['has_pooler']:
            print(f"\n⏭️  Skipping {model_key} + {pooling_key}: No pooler")
            return None
        
        combination_name = f"{model_key}_{pooling_key}"
        display_name = f"{model_info['name']} + {POOLING_STRATEGIES[pooling_key]}"
        
        print(f"\n{'='*70}")
        print(f"🚀 Training: {display_name}")
        print(f"{'='*70}")
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_info['model_name'])
        
        # Create datasets
        train_dataset = BBCNewsDataset(
            train_df['text'].values,
            train_df['label'].values,
            tokenizer,
            TRAINING_CONFIG['max_length']
        )
        val_dataset = BBCNewsDataset(
            val_df['text'].values,
            val_df['label'].values,
            tokenizer,
            TRAINING_CONFIG['max_length']
        )
        test_dataset = BBCNewsDataset(
            test_df['text'].values,
            test_df['label'].values,
            tokenizer,
            TRAINING_CONFIG['max_length']
        )
        
        # Create dataloaders
        train_loader = DataLoader(
            train_dataset,
            batch_size=TRAINING_CONFIG['batch_size'],
            shuffle=True
        )
        val_loader = DataLoader(
            val_dataset,
            batch_size=TRAINING_CONFIG['eval_batch_size']
        )
        test_loader = DataLoader(
            test_dataset,
            batch_size=TRAINING_CONFIG['eval_batch_size']
        )
        
        # Initialize model
        model = BERTWithCustomPooling(
            model_info['model_name'],
            pooling_strategy=pooling_key,
            num_labels=len(label_map)
        ).to(self.device)
        
        # Optimizer and scheduler
        optimizer = AdamW(
            model.parameters(),
            lr=TRAINING_CONFIG['learning_rate'],
            weight_decay=TRAINING_CONFIG['weight_decay']
        )
        
        total_steps = len(train_loader) * TRAINING_CONFIG['num_epochs']
        warmup_steps = int(total_steps * TRAINING_CONFIG['warmup_ratio'])
        scheduler = get_linear_schedule_with_warmup(
            optimizer,
            num_warmup_steps=warmup_steps,
            num_training_steps=total_steps
        )
        
        loss_fn = nn.CrossEntropyLoss()
        
        # Training loop
        best_val_acc = 0
        train_start = datetime.now()
        
        for epoch in range(TRAINING_CONFIG['num_epochs']):
            # Train
            model.train()
            train_loss = 0
            train_preds = []
            train_labels = []
            
            for batch in tqdm(train_loader, desc=f"Epoch {epoch+1}/{TRAINING_CONFIG['num_epochs']}"):
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['label'].to(self.device)
                
                optimizer.zero_grad()
                
                logits = model(input_ids, attention_mask)
                loss = loss_fn(logits, labels)
                
                loss.backward()
                optimizer.step()
                scheduler.step()
                
                train_loss += loss.item()
                preds = torch.argmax(logits, dim=1).cpu().numpy()
                train_preds.extend(preds)
                train_labels.extend(labels.cpu().numpy())
            
            train_acc = accuracy_score(train_labels, train_preds)
            
            # Validate
            val_acc, val_loss = self.evaluate(model, val_loader, loss_fn)
            
            print(f"Epoch {epoch+1}: Train Loss={train_loss/len(train_loader):.4f}, "
                  f"Train Acc={train_acc:.4f}, Val Acc={val_acc:.4f}")
            
            if val_acc > best_val_acc:
                best_val_acc = val_acc
        
        train_time = (datetime.now() - train_start).total_seconds()
        
        # Final evaluation on test set
        test_acc, test_loss, test_metrics = self.evaluate_detailed(model, test_loader, loss_fn, list(label_map.keys()))
        
        print(f"\n✅ Training completed!")
        print(f"   Best Val Acc: {best_val_acc:.4f}")
        print(f"   Test Acc: {test_acc:.4f}")
        print(f"   Train Time: {train_time:.1f}s")
        
        # Save results
        results = {
            'model_base': model_key,
            'pooling_strategy': pooling_key,
            'display_name': display_name,
            'accuracy': test_acc * 100,
            'precision': test_metrics['precision'] * 100,
            'recall': test_metrics['recall'] * 100,
            'f1_score': test_metrics['f1'] * 100,
            'train_time_seconds': train_time,
            'confusion_matrix': test_metrics['confusion_matrix'].tolist(),
            'per_class_metrics': test_metrics['per_class_metrics']
        }
        
        output_file = self.output_dir / f"{combination_name}" / "results.json"
        output_file.parent.mkdir(exist_ok=True)
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        return results
    
    def evaluate(self, model, dataloader, loss_fn):
        """Evaluate model"""
        model.eval()
        total_loss = 0
        all_preds = []
        all_labels = []
        
        with torch.no_grad():
            for batch in dataloader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['label'].to(self.device)
                
                logits = model(input_ids, attention_mask)
                loss = loss_fn(logits, labels)
                
                total_loss += loss.item()
                preds = torch.argmax(logits, dim=1).cpu().numpy()
                all_preds.extend(preds)
                all_labels.extend(labels.cpu().numpy())
        
        acc = accuracy_score(all_labels, all_preds)
        avg_loss = total_loss / len(dataloader)
        
        return acc, avg_loss
    
    def evaluate_detailed(self, model, dataloader, loss_fn, class_names):
        """Detailed evaluation with metrics"""
        acc, loss = self.evaluate(model, dataloader, loss_fn)
        
        # Get predictions
        model.eval()
        all_preds = []
        all_labels = []
        
        with torch.no_grad():
            for batch in dataloader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['label'].to(self.device)
                
                logits = model(input_ids, attention_mask)
                preds = torch.argmax(logits, dim=1).cpu().numpy()
                all_preds.extend(preds)
                all_labels.extend(labels.cpu().numpy())
        
        # Calculate metrics
        precision, recall, f1, _ = precision_recall_fscore_support(
            all_labels, all_preds, average='weighted', zero_division=0
        )
        
        # Per-class metrics
        precision_per_class, recall_per_class, f1_per_class, _ = precision_recall_fscore_support(
            all_labels, all_preds, average=None, zero_division=0
        )
        
        per_class_metrics = [
            {
                'class': class_names[i],
                'precision': float(precision_per_class[i]),
                'recall': float(recall_per_class[i]),
                'f1': float(f1_per_class[i])
            }
            for i in range(len(class_names))
        ]
        
        # Confusion matrix
        cm = confusion_matrix(all_labels, all_preds)
        
        metrics = {
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'confusion_matrix': cm,
            'per_class_metrics': per_class_metrics
        }
        
        return acc, loss, metrics


# ========== Main ==========

def main():
    """Train all 8 BERT configurations"""
    
    print("="*70)
    print("BBC NEWS CLASSIFICATION - BERT FINE-TUNING")
    print("="*70)
    
    # Load data
    trainer = BERTTrainer()
    train_df, val_df, test_df, label_map = load_bbc_news()
    
    # Train all combinations
    results = []
    
    for model_key in BERT_MODELS.keys():
        for pooling_key in POOLING_STRATEGIES.keys():
            result = trainer.train_combination(
                model_key, pooling_key,
                train_df, val_df, test_df, label_map
            )
            if result:
                results.append(result)
    
    # Summary
    print(f"\n{'='*70}")
    print("🎉 ALL TRAINING COMPLETED!")
    print(f"{'='*70}")
    print(f"\nTrained {len(results)} configurations:\n")
    
    for r in sorted(results, key=lambda x: x['accuracy'], reverse=True):
        print(f"  {r['display_name']:<30} Acc: {r['accuracy']:.2f}%")


if __name__ == '__main__':
    main()
