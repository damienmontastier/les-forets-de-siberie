<template>
  <div class="home">
    <div class="loader"></div>
    <div class="intro">
      <Title ref="title"></Title>
      <div class="headphones" ref="headphones">
        <HeadphonesIcon />
        <HeadphonesText />
      </div>
    </div>
    <video
      src="/videos/intro.mp4"
      ref="intro"
      style="transform: scale(1.05);"
    ></video>
    <video src="/videos/pied.mp4" ref="pied"></video>
  </div>
</template>

<script>
import Intro from '@/webGL/stages/Intro'
import Title from '@/components/svg/IntroTitle'
import Events from '@/plugins/events'
import HeadphonesText from '@/components/svg/HeadphonesText'
import HeadphonesIcon from '@/components/svg/HeadphonesIcon'
import gsap from 'gsap'

export default {
  name: 'intro',
  components: {
    Title,
    HeadphonesText,
    HeadphonesIcon,
  },
  mounted() {
    this.$nextTick(() => {
      this.$webgl.add('intro', Intro)
    })
    this.$refs.intro.addEventListener('ended', () => {
      console.log('this.$refs.intro', 'ended')
      this.$refs.intro.style.opacity = 0
      this.$refs.pied.style.opacity = 1
      this.$refs.pied.play()
    })
    this.$refs.pied.addEventListener('ended', () => {
      this.$router.push('/avril')
    })
    Events.once('intro end', () => {
      let tl = new gsap.timeline()
      tl.to(this.$refs.headphones, 1, {
        onStart: () => {
          this.$refs.title.$el.style.display = 'none'
          this.$refs.headphones.style.display = 'block'
        },
        opacity: '1',
      })
      tl.to(this.$refs.intro, 1, {
        delay: 3,
        opacity: 1,
        onStart: () => {
          this.$refs.headphones.style.display = 'none'
          this.$refs.intro.play()
        },
      })
    })
  },
}
</script>

<style lang="scss">
.home {
  position: relative;
  width: 100%;
  height: 100vh;

  .loader {
    background: url('/assets/intro/loader.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .intro {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 250px;
    svg {
      width: 100%;
    }
  }

  .headphones {
    display: none;
    opacity: 0;
  }

  video {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1000;
    opacity: 0;
  }
}
</style>
