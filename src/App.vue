<template>
  <div id="app">
    
    <h3> Querying a list </h3>
    <button @click="getChampions">Get Hero List</button><br>
    <table>
      <tr v-if="champions">
        <th>Hero</th>
        <th>Power</th>
      </tr>
      <tr v-for="champion in champions"  :key="champion.name">
        <td>{{ champion.name }}</td>
        <td>{{ champion.power }}</td>
      </tr>
    </table>
<hr>
    <h3>Querying a specific item</h3>
    Name: <input v-model="heroname_search">
    <button @click="getChampionByName">Get Hero</button>
    <div v-if="search_result === true">
      <form >
        Hero :<br>
        <input type="text"  readonly :value="champion.name" ><br>
        Power:<br>
        <input type="text"  readonly :value="champion.power">
      </form>
    </div>
    <hr>
    <h3>Mutating a value</h3>
    Name: <input v-model="name">
    Power: <input v-model.number="power">
    <button @click="updatePower">Update Hero</button>
    <div>
      Updated Hero Record <br>{{ updatedChampion }}
    </div>
    

  </div>
</template>

<script>
import axios from 'axios'
const URL = 'http://localhost:4000/graphql';
export default {
  name: 'app',

  data () {
    return {
      champions: [],
      heroname_search: '',
      search_result: false,
      name: '',
      power: 0,
      champion: {},
      updatedChampion: {}
    }
  },

  methods: {

    async getChampions () {
     try{
      const res = await axios.post(URL, 
      {
        query: `{ 
          getChampions { 
            name,
            power
          } 
        }`
      })
      this.champions = res.data.data.getChampions
      } catch(err){
        console.log("Error ", err);
      }
    },

    async getChampionByName () {
      console.log("Looking for name [", this.heroname_search + " ]");
      try{
        this.search_result = false;
        const res = await axios.post(URL, 
        {
          query: ` 
          query GetChampionByName($championName: String!) {
            getChampionByName(name: $championName) { 
              name
              power
            }  
          }`,
          variables: {
            championName: this.heroname_search
          }
        })
        this.champion = res.data.data.getChampionByName
        this.search_result = true;
      } catch (error){
        this.search_result = false;
      }
    },

    async updatePower () {
      const res = await axios.post(URL, 
      {
        query: ` 
        mutation UpdatePower($championName: String!, $power: Float) {
          updatePower(name: $championName, power: $power) { 
            name
            power
          }  
        }`,
        variables: {
          championName: this.name,
          power: this.power
        }
      })
      this.updatedChampion = res.data.data.updatePower
    }

  }
}
</script>

<style>
#app {
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 30px;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

</style>
