<template>
  <div class="about">
    <img src="@/assets/img/bg.jpg" style="width: 100%" />
    <div class="background">
      <div class="word">
        <h1>Indonesia Wildfires in 2020</h1>
        <h2>By Yongxuan Guo</h2>
        <div class="content">
          <p>
            Almost every year, a smoky haze blankets the South East Asian region
            - signalling the return of forest fires in Indonesia.
          </p>
          <p>
            According to Indonesia's national disaster agency, there were
            328,724 hectares of land burnt in 2019 from January to August alone.
          </p>
          <p>
            The haze usually measures hundreds of kilometres across. It has
            spread to Malaysia, Singapore, the south of Thailand and the
            Philippines, causing a significant deterioration in air quality.
          </p>
          <p>
            In the meantime Indonesian authorities struggle to put out the
            fires, many of which have flared up on flammable and dry peat-rich
            areas.
          </p>
          <p>
            Indonesia has been dumping millions of litres of water in affected
            areas and has sent in the army to help fire fighters.
          </p>
          <p>
            A peat fire is difficult to put out as it can burn underground for
            months, and requires a lot of water to extinguish. Fires can spread
            underground and spring up in other places later.
          </p>
          <p>
            Since the situation is really severe, we want to take a look how
            wildfire burnt in Indonesia, 2020.
          </p>
          <p style="font-weight: bold; color: rgb(255, 20, 50)">
            We mapped all fire points on the map during the fire season.
          </p>
          <p>
            Users can freely select the day they want or simply click play
            button and the fire trend will show itself.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style  lang="scss" scoped>
.about {
  position: fixed;
  width: 100%;
  height: 97%;
  top: 3%;
  left: 0px;

  .word {
    text-align: center;
    position: absolute;
    width: 70%;
    height: 75%;
    left: 15%;
    right: 15%;
    top: 15%;
    bottom: 10%;
    background-color: rgba(221, 200, 200, 0.486);
    .content {
      color: black;
      font-size: 20px;
      text-align: left;
      text-indent: 30px;
      word-break: break-word;
      margin: 12px;
      line-height: 30px;
    }
  }
}
</style>
