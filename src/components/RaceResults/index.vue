<template>
  <div class="results-container">
    <h3>Results</h3>

    <div v-if="results.length === 0" class="empty-state">
      No races finished yet.
    </div>

    <div class="results-list">
      <div v-for="result in results" :key="result.roundId" class="round-table">
        <div class="table-header">
          <span>{{ result.roundId }}st Round - {{ result.distance }}m</span>
        </div>

        <table class="results-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(horse, pos) in result.positions" :key="horse.id">
              <td>{{ pos + 1 }}</td>
              <td class="horse-cell">
                <span class="horse-name">{{ horse.name }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "RaceResults",
  setup() {
    const store = useStore();
    const results = computed(() => store.getters.results);

    return { results };
  },
};
</script>

<style scoped lang="scss">
.results-container {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  h3 {
    margin-top: 0;
    color: #2c3e50;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
    text-align: center;
    flex-shrink: 0;
  }
}

.results-list {
  overflow-y: auto;
  padding-right: 4px;
  flex-grow: 1;
}

.round-table {
  margin-bottom: 2rem;
  text-align: center;
}

.table-header {
  background: #f3f3f3;
  padding: 6px 10px;
  font-weight: bold;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;

  th {
    background: #ececec;
    padding: 6px;
    font-size: 0.85rem;
    border: 1px solid #ddd;
  }

  td {
    border: 1px solid #ddd;
    padding: 6px;
    font-size: 0.85rem;
  }
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #999;
}

.horse-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
