<script>
  const socials = [{
    label: 'Wechat'
  }, {
    label: 'Weibo',
    url: 'https://weibo.com/1768830500/profile?topnav=1&wvr=6&is_all=1'
  }, {
    label: 'Netease Music',
    url: 'https://music.163.com/#/user/home?id=261618415'
  }, {
    label: 'Code Pen',
    url: 'https://codepen.io/glorywong'
  }, {
    label: 'Facebook',
    url: 'https://www.facebook.com/glorywongzhaohui'
  }, {
    label: 'Twitter',
    url: 'https://twitter.com/glorywong1001'
  }, {
    label: 'Instagram',
    url: 'https://www.instagram.com/glorywong1001/'
  }, {
    label: 'Github',
    url: 'https://github.com/glorywong'
  }, {
    label: 'Email',
    url: 'mailto:glorywong1001@gmail.com'
  }];
</script>

<div class="social">
  <ul class="social-list">
    {#each socials as { label, url }}
    <li class="social-list__item">
      <a href={url} target="_blank">{label}</a>
    </li>
    {/each}
  </ul>
</div>

<style lang="sass">
  .social
    &-list
      &__item
        margin: 1.5em 0
        a
          background-color: #9C27B0
          border-radius: 0.7em
          padding: 0.3em 0.7em
          color: white
          cursor: pointer

          &:hover 
            background-color: #7b1fa2
            text-decoration: none
</style>