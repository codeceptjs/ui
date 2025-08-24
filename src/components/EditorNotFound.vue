<template>
  <b-modal
    v-if="error"
    :active.sync="isOpened"
    :width="640"
    scroll="keep"
  >
    <b-message
      :title="error.message"
      type="is-danger"
      @close="close()"
      aria-close-label="Close message"
    >
      <div
        class="description"
        v-if="error.description"
      >
        <code>{{ error.description }}</code>
      </div>
      <div>
        <h4>Configure an editor in <i class="fas fa-cog" /> Settings </h4>
      </div>
      <p>
        To open files you should specify a valid executable for an editor (with arguments). 
        Learn how to setup popular editors from their docs:
      </p>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://code.visualstudio.com/docs/editor/command-line"
          >Visual Studio Code</a> &rarr; <span class="exec">code --goto</span>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.jetbrains.com/help/webstorm/working-with-the-ide-features-from-command-line.html"
          >Webstorm</a> &rarr; <span class="exec">webstorm</span>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.sublimetext.com/docs/3/osx_command_line.html"
          > Sublime text</a> &rarr; <span class="exec">subl</span>
        </li>
      </ul>
      <div>
        <p>
          For other editors set their terminal command.
        </p>
      </div>
    </b-message>
  </b-modal>
</template>

<script>
export default {
  name: 'ScenarioSource',
  props: {
    error: {
      type: Object,
      required: false,
      default: null,
    },
    isOpened: {
      type: Boolean,
      default: false,
    }
  },  
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.description {
  @apply mb-4;
}
p {
  @apply py-4 text-gray-600;

}
.exec {
  @apply bg-gray-800 text-white ml-2 mr-2 px-1;
}

</style>