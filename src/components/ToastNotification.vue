<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast-item"
        :class="[`toast-${toast.type}`, { 'toast-dismissible': toast.dismissible }]"
      >
        <div class="toast-icon">
          <i :class="getIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title" v-if="toast.title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button 
          v-if="toast.dismissible" 
          @click="dismissToast(toast.id)"
          class="toast-dismiss"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'ToastNotification',
  data() {
    return {
      toasts: []
    };
  },
  methods: {
    show(message, options = {}) {
      const toast = {
        id: Date.now() + Math.random(),
        message,
        type: options.type || 'info',
        title: options.title || '',
        dismissible: options.dismissible !== false,
        duration: options.duration || 4000
      };
      
      this.toasts.push(toast);
      
      if (toast.duration > 0) {
        setTimeout(() => {
          this.dismissToast(toast.id);
        }, toast.duration);
      }
      
      return toast.id;
    },
    
    dismissToast(id) {
      const index = this.toasts.findIndex(t => t.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },
    
    success(message, options = {}) {
      return this.show(message, { ...options, type: 'success' });
    },
    
    error(message, options = {}) {
      return this.show(message, { ...options, type: 'error', duration: 6000 });
    },
    
    warning(message, options = {}) {
      return this.show(message, { ...options, type: 'warning' });
    },
    
    info(message, options = {}) {
      return this.show(message, { ...options, type: 'info' });
    },
    
    getIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };
      return icons[type] || icons.info;
    }
  }
};
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.toast-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border-left: 4px solid;
  
  &.toast-success {
    background: rgba(240, 253, 244, 0.95);
    border-left-color: #10b981;
    color: #047857;
  }
  
  &.toast-error {
    background: rgba(254, 242, 242, 0.95);
    border-left-color: #ef4444;
    color: #dc2626;
  }
  
  &.toast-warning {
    background: rgba(255, 251, 235, 0.95);
    border-left-color: #f59e0b;
    color: #d97706;
  }
  
  &.toast-info {
    background: rgba(239, 246, 255, 0.95);
    border-left-color: #3b82f6;
    color: #1d4ed8;
  }
}

.toast-icon {
  margin-right: 12px;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  
  .toast-title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 0.95rem;
  }
  
  .toast-message {
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.toast-dismiss {
  background: none;
  border: none;
  color: currentColor;
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
  }
}

// Animations
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>