<template>
  <div>
    <Navbar />
    <section class="hero is-link is-fullheight-with-navbar">
      <div class="hero-body">
        <!--
        <div v-if="isDone" class="container imagesContainer">
          <div v-for="item in imagesArray" :key="item.url">
            <img :src="item" style="padding: 10px;" />
          </div>
        </div>
        -->
        <div v-if="isDone" style="margin-left: 35%; margin-right: 30%;">
          <div
            class="card"
            v-for="item in testniArray"
            :key="item.url"
            style="margin-bottom: 30px; width: 28vw;"
          >
            <div class="card-content" style="display: flex;">{{ item.lokacija }}</div>
            <div class="card-image">
              <figure class="image is-4by5">
                <img :src="item.url" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default {
  name: "Home",
  components: {
    Navbar,
    Footer
  },
  data: function() {
    return {
      locationArray: [],
      imagesArray: [],
      testniArray: [],
      isDone: false
    };
  },
  methods: {},
  beforeMount() {
    axios.get("http://localhost:5000/api/v1/kamere").then(response => {
      console.log(response);
      for (var i = 0; i < 138; i++) {
        let obj = {
          lokacija: response.data[i].name,
          url: response.data[i].url
        };
        this.testniArray[i] = obj;
        this.locationArray[i] = response.data[i].name;
        this.imagesArray[i] = response.data[i].url;
      }
      this.isDone = true;
    });
  },
  mounted() {
    console.log("Mounted");
  }
};
</script>

<style scoped>
.imagesContainer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 30px;
  justify-items: center;
  row-gap: 15px;
}

@media (max-width: 475px) {
  .imagesContainer {
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    margin: 10px;
  }
}

.hero {
  background-color: white;
}
</style>