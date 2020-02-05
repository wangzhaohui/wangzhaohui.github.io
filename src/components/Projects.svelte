<script>
  const projects = [{
    label: '2019-nCoV in Xiaogan',
    url: '/2019ncov-xiaogan/',
    image: ''
  }];
</script>

<div class="projects">
  <ul class="project-list">
    {#each projects as { label, url, image }}
    <li class="project-list__item">
      <a href={url} target="_blank">
        <div class="project-box">
          <div class="project-box__header">
            <img src={image}>
          </div>
          <div class="project-box__title">{label}</div>
        </div>
      </a>
    </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .projects {
    .project-list {
      &__item {
        marigin-right: 20px;
        display: inline-block;
        a {
          &:hover {
            text-decoration: none;
          }
          .project-box {
            $boxColor: #0097A7;
            width: 150px;
            height: 200px;
            display: flex;
            flex-direction: column;
            background: white;
            border-radius: 4px;
            box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            &__header {
              background: $boxColor;
              flex-grow: 1;
            }
            &__title {
              padding: 10px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              color: #333;
            }
          }
        }
      }
    }
  }
</style>