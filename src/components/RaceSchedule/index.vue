<template>
  <div class="schedule-container">
    <h3>Program</h3>

    <div v-if="schedule.length === 0" class="empty-state">
      Schedule not generated.
    </div>

    <div class="schedule-list">
      <div v-for="round in schedule" :key="round.id" class="round-table">
        <div class="table-header">
          <span>{{ round.id }}st Round - {{ round.distance }}m</span>
        </div>

        <table class="horse-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(horse, index) in round.horses" :key="horse.id">
              <td>{{ index + 1 }}</td>
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
  name: "RaceSchedule",
  setup() {
    const store = useStore();
    const schedule = computed(() => store.getters.schedule);
    const currentRoundIndex = computed(() => store.getters.currentRoundIndex);

    return { schedule, currentRoundIndex };
  },
};
</script>

<style scoped lang="scss">
.schedule-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;

  h3 {
    margin-top: 0;
    color: #2c3e50;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
    text-align: center;
    flex-shrink: 0;
  }
}

.schedule-list {
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

.horse-table {
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

.horse-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
