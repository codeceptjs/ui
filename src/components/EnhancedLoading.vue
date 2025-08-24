<template>
  <div class="enhanced-loading-overlay" v-if="visible">
    <div class="loading-container">
      <div class="loading-animation">
        <div class="loading-spinner">
          <i class="fas fa-cog fa-spin primary-spinner"></i>
          <i class="fas fa-circle-notch fa-spin secondary-spinner"></i>
        </div>
        <div class="loading-message">
          <h3>{{ title }}</h3>
          <p v-if="message">{{ message }}</p>
          <div class="progress-indicator" v-if="showProgress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </div>
      </div>
      <button 
        v-if="cancellable" 
        @click="$emit('cancel')"
        class="cancel-button"
        type="button"
      >
        <i class="fas fa-times"></i>
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnhancedLoading',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Loading...'
    },
    message: {
      type: String,
      default: ''
    },
    progress: {
      type: Number,
      default: 0
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    cancellable: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.enhanced-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loading-container {
    text-align: center;
    max-width: 400px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }
  
  .loading-animation {
    margin-bottom: 20px;
  }
  
  .loading-spinner {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
    
    .primary-spinner {
      font-size: 2.5rem;
      color: #6f42c1;
      animation: spin 2s linear infinite;
    }
    
    .secondary-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      color: #9f7aea;
      animation: spin 1s linear infinite reverse;
    }
  }
  
  .loading-message {
    h3 {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: #374151;
    }
    
    p {
      margin: 0 0 16px 0;
      color: #6b7280;
      font-size: 0.95rem;
    }
  }
  
  .progress-indicator {
    margin-top: 16px;
    
    .progress-bar {
      width: 100%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #6f42c1, #9f7aea);
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }
    
    .progress-text {
      font-size: 0.85rem;
      color: #6b7280;
      font-weight: 500;
    }
  }
  
  .cancel-button {
    margin-top: 16px;
    padding: 8px 16px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #6b7280;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #e5e7eb;
      color: #374151;
    }
    
    i {
      margin-right: 6px;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>