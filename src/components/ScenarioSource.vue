<template>
  <div class="ScenarioSource">
    <pre v-highlightjs="source"><code class="javascript" /></pre>
    <b-button
      v-if="file"
      type="is-light is-small"
      expanded
      @click="editFile()"
    >
      <i class="fas fa-edit" /> Edit Test
    </b-button>
    <b-modal
      :active.sync="isOpened"
      :width="640"
      scroll="keep"
    >
      <div class="card">
        <div class="card-content">
          <div class="content">
            <div class="error">
              <span>Error message:</span> <span class="error-message">{{ errorMessage }}</span>
            </div>
            <div class="error">
              <span>Description: <span class="error-message">{{ errorMessageDescription }}</span> </span>
            </div>
            <div>
              <h1>Try example solutions</h1>
              <h3>Install simple editors</h3>
            </div>
            <ul>
              <li>
                <div>
                  <a
                    href="https://code.visualstudio.com/Download"
                    target="_blank"
                  >Download Visual studio code</a>
                </div>
                <div>
                  <a
                    href="https://code.visualstudio.com/docs/setup/setup-overview"
                    target="_blank"
                  >
                    Setup overview visual studio code
                  </a>
                </div>
                <span>Command  <span style="color: white; background-color: black">code</span></span>
              </li>
              <li>
                <div>
                  <a href="https://www.jetbrains.com/webstorm/download/">Download Webstorm</a>
                </div>
                <div>
                  <ol>
                    <li>Try in terminal 'wstorm' and 'webstorm'</li>
                    <li>If the commands don't work you can run in WebStorm: "Tools" -> "Create Command Line Launcher..."</li>
                  </ol>
                  <span>Note: The solution works only for Linux / MacOS</span>
                  <div>
                    <span>Command  <span style="color: white; background-color: black">wstorm</span></span>
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <a href="https://www.sublimetext.com/"> Sublime text</a>
                </div>
              </li>
            </ul>
            <div>
              <h2>
                If you do not have an editor that is called through the console. Or you have a problem with calling him. Then we can offer you a live editor
              </h2>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ScenarioSource',
  data() {
    return {
      isOpened: false,
      errorMessage: '',
      errorMessageDescription: ''
    };
  },
  props: {
    source : {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    }
  },
  components: {},
  methods: {
    editFile() {
      axios
        .get(`/api/tests/${encodeURIComponent(this.file)}/open`)
        .then(() => {
          this.state.errorMessage = '';
          this.errorMessageDescription = '';
        })
        .catch((error) => {
          const { response: {
            data: {
              message,
              description
            }
          } } = error;
          this.errorMessage = message;
          this.errorMessageDescription = description;
          this.openModal();
        });
    },
    openModal() {
      this.isOpened = !this.isOpened;
    }
  }
};
</script>

<style>
.ScenarioSource {
    font-size: .9rem;
}

.ScenarioSource pre {
    padding: 0;
    background-color: white;
}

.ScenarioSource code {
    overflow: hidden;
}
.error {
}
.error-message {
  @apply text-red-600 mx-24;
}
</style>


