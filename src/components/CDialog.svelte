<script>
  import { onMount } from 'svelte';
  export let visible = false;

  let mask, dialog;
  $: {
    if (mask) {
      if (visible) {
        mask.classList.remove('hidden');
      } else {
        mask.classList.add('hidden');
      }
    }
  }

  let closeDialog = () => {
    visible = false;
  };
  
  onMount(() => {
    mask.addEventListener('click', (evt) => {
      if (!evt.target.classList.contains('dialog')) {
        closeDialog();
      }
    });
    // mask.addEventListener('')
  });
</script>

<div class="mask hidden" bind:this="{mask}">
  <div class="dialog" bind:this="{dialog}">
    <div class="close-btn"></div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</div>

<style lang="scss">
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.3);
    
    &.hidden {
      background: red;
      display: none;
    }
  }

  .dialog {
    padding: 5px;
    max-width: 80%;
    max-height: 80%;
  }
</style>
