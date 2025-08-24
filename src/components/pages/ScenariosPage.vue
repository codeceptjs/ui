<template>
  <div class="ScenariosPage">
    <b-navbar 
      fixed-top
      :mobile-burger="true"
    >
      <template slot="brand">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/' }"
        >
          <Logo />
        </b-navbar-item>      
        <b-navbar-item>
          <RunButton @run="run()" />
        </b-navbar-item>           
        <b-navbar-item>
          <RuntimeModeIndicator />
        </b-navbar-item>           
        <b-navbar-item class="is-hidden-desktop">
          <SettingsMenu />
        </b-navbar-item>   
      </template>
      <template slot="start">
        <b-navbar-item>
          <a
            class="navbar-item"
            role="button"
            @click="gotoNewTest()"
          >
    
            <i class="fas fa-edit mr-2" />
            Write a Test
          </a>
          <a
            class="navbar-item"
            role="button"
            @click="gotoPageObjects"
          >
            <i class="fas fa-file mr-2" />
            Page Objects
          </a>
        </b-navbar-item>
        <b-navbar-item class="hide-on-small">
          <p class="control ">
            <input
              class="input is-small"
              @focus="$event.target.select()"
              type="text"
              placeholder="Search"
              v-model="search"
              @input="loadProject()"
            >
          </p>
          <p class="control">
            <a
              class="button is-small"
              @click="clearSearch()"
            >
              <i class="far fa-times-circle" />
            </a>
            <a
              class="button is-small"
              v-if="isMatchType('all')"
              @click="selectMatchType('any')"
            >All</a>
            <a
              class="button is-small"
              v-if="isMatchType('any')"
              @click="selectMatchType('all')"
            >Any</a>
          </p>
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item class="is-hidden-touch">
          <SettingsMenu />
        </b-navbar-item>
      </template>
    </b-navbar>
    <section
      class="Project"
      v-if="project.name"
    >
      <div class="container">
        <h1 class="title">
          {{ project.name }}
        </h1>
      </div>
    </section>
    <section>
      <div class="container">
        <Test-statistics
          :features="project.features"
          v-if="project.features"
        />
      </div>
    </section>
    <section class="ide-layout">
      <div
        class="ide-container"
        :class="{ 'with-preview': showPreview && selectedTest }"
      >
        <div class="test-list-panel">
          <div class="container">
            <ul
              v-if="hasSearchResults"
              class="mb-8"
            >
              <li
                :key="capability"
                v-for="(features, capability) in project.features"
              >
                <div class="Capability">
                  <h2 class="Capability-headline is-size-6">
                    <CapabilityFolder :folder="capability" />
                  </h2>

                  <div class="Capability-content">
                    <feature
                      :feature="feature"
                      :key="feature.feature.title"
                      v-for="feature in features"
                      @test-selected="selectTest"
                    />
                  </div>
                </div>
              </li>
            </ul>
            <b-message v-else>
              No features or scenario are matching your search
            </b-message>
          </div>
        </div>
        
        <!-- IDE-like preview panel -->
        <div
          v-if="showPreview && selectedTest"
          class="test-preview-panel"
        >
          <div class="preview-header">
            <h3 class="preview-title">
              {{ selectedTest.title }}
            </h3>
            <button 
              class="button is-small"
              @click="togglePreview"
              title="Close preview"
            >
              <i class="fas fa-times" />
            </button>
          </div>
          <div class="preview-content">
            <div class="test-info">
              <p><strong>File:</strong> {{ selectedTest.file }}</p>
              <p><strong>Line:</strong> {{ selectedTest.line || 'N/A' }}</p>
            </div>
            <div
              class="test-code"
              v-if="selectedTest.body"
            >
              <pre><code class="javascript">{{ selectedTest.body }}</code></pre>
            </div>
            <div
              v-else
              class="loading-placeholder"
            >
              Loading test code...
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from 'axios';
import Feature from '../Feature';
import CapabilityFolder from '../CapabilityFolder';
import SettingsMenu from '../SettingsMenu';
import TestStatistics from '../TestStatistics';
import RunButton from '../RunButton';
import RuntimeModeIndicator from '../RuntimeModeIndicator';
import Logo from '../Logo';

export default {
  name: 'Scenarios',
  components: {
    Logo,
    Feature,
    CapabilityFolder,
    SettingsMenu,
    TestStatistics,
    RunButton,
    RuntimeModeIndicator
  },
  data() {
    return {
      loading: false,
      search: '',
      matchType: 'any',
      project: {},
      loadProjectTimeout: null,
      showPreview: false,
      selectedTest: null
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.search = urlParams.get('q') || '';
    this.loadProject();
    this.loadScenarioStatus();
  },
  sockets: {
    'codeceptjs:scenarios.updated': function() {
      this.loadProject(true);
    },
    'codeceptjs:config.updated': function() {
      // Reload project when config changes as it might affect test discovery
      this.loadProject(true);
    },
    'codeceptjs:file.changed': function() {
      // Auto-reload project when any watched file changes
      this.loadProject(true);
    }
  },
  computed: {
    hasSearchResults() {
      return (
        this.project &&
        this.project.features &&
        Object.keys(this.project.features).length > 0
      );
    }
  },
  methods: {
    run() {
      if (!this.search) {
        return this.$store.dispatch('testRuns/runAll');
      }
      this.$store.dispatch('testRuns/runGrep', this.search);
    },
    gotoNewTest() {
      this.$router.push('/new-test');
    },
    gotoPageObjects() {
      this.$router.push('/page-objects');
    },
    clearSearch() {
      this.search = '';
      this.loadProject(true);
    },

    selectMatchType(t) {
      this.matchType = t;
      this.loadProject(true);
    },

    isMatchType(t) {
      return this.matchType === t;
    },

    updateUrl() {
      history.pushState(
        {},
        '',
        `/?q=${encodeURIComponent(this.search)}&m=${this.matchType}`
      );
    },

    selectTest(test) {
      if (window.innerWidth >= 1024) { // Only show preview on desktop
        this.selectedTest = test;
        this.showPreview = true;
        this.loadTestCode(test);
      }
    },

    togglePreview() {
      this.showPreview = !this.showPreview;
    },

    async loadTestCode(test) {
      if (test.body) return; // Already loaded
      
      try {
        const response = await axios.post('/api/file', { 
          path: test.file,
          line: test.line 
        });
        
        if (response.data && response.data.source) {
          this.$set(this.selectedTest, 'body', response.data.source);
        }
      } catch (err) {
        this.$set(this.selectedTest, 'body', 'Unable to load test code');
      }
    },

    async loadScenarioStatus() {
      this.$store.dispatch('scenarios/loadInitialScenarioStatus');
    },

    async loadProject(immediate = false) {
      // Debounce the search to improve performance
      if (this.loadProjectTimeout) {
        clearTimeout(this.loadProjectTimeout);
      }
      
      if (!immediate) {
        this.loadProjectTimeout = setTimeout(() => this.loadProject(true), 300);
        return;
      }
      
      this.updateUrl();

      this.loading = true;
      const loadingComponent = this.$buefy.loading.open({ container: null });

      try {
        const response = await axios.get(
          `/api/scenarios?q=${this.search}&m=${this.matchType}`
        );
        this.project = response.data;
      } finally {
        this.loading = false;
        loadingComponent.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ide-layout {
  margin-top: 20px;
}

.ide-container {
  display: flex;
  height: calc(100vh - 200px);
  
  &.with-preview {
    .test-list-panel {
      width: 60%;
      border-right: 1px solid #e5e5e5;
    }
  }
}

.test-list-panel {
  width: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.test-preview-panel {
  width: 40%;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  border-left: 1px solid #e5e5e5;
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: white;
    border-bottom: 1px solid #e5e5e5;
    
    .preview-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #363636;
    }
  }
  
  .preview-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    
    .test-info {
      margin-bottom: 20px;
      padding: 15px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e5e5e5;
      
      p {
        margin-bottom: 8px;
        font-size: 14px;
        
        strong {
          color: #6f42c1;
          font-weight: 600;
        }
      }
    }
    
    .test-code {
      background: white;
      border-radius: 6px;
      border: 1px solid #e5e5e5;
      overflow-x: auto;
      
      pre {
        margin: 0;
        padding: 20px;
        background: transparent;
        font-size: 13px;
        line-height: 1.5;
        
        code {
          background: transparent;
          color: #333;
          font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        }
      }
    }
    
    .loading-placeholder {
      padding: 40px;
      text-align: center;
      color: #7a7a7a;
      font-style: italic;
    }
  }
}

// Hide preview on mobile/tablet
@media (max-width: 1023px) {
  .test-preview-panel {
    display: none;
  }
  
  .ide-container.with-preview .test-list-panel {
    width: 100%;
    border-right: none;
  }
}

.hide-on-small {
  @media (max-width: 768px) {
    display: none !important;
  }
}
</style>

<style>
.Project {
  @apply mt-5 ml-2;
}

.SearchField input {
  width: 220px;
}

.Capability {
  padding: 0.5rem;
}

.Capability-content {
  padding-left: 1rem;
}

.Capability-headline {
  margin-top: 0.25rem;
}


</style>
