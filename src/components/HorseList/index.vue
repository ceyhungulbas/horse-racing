<template>
  <div class="horse-table-container">
    <h3>Horse List (1-20)</h3>

    <div class="table-scroll-wrapper">
      <table class="horse-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td>{{ horse.condition }}</td>
            <td>
              <span
                class="color-box"
                :style="{ backgroundColor: horse.color }"
              ></span>
            </td>
          </tr>

          <tr v-if="horses.length === 0">
            <td colspan="3" class="empty-state">No horses generated yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "HorseList",
  setup() {
    const store = useStore();
    const horses = computed(() => store.getters.allHorses);

    return { horses };
  },
};
</script>

<style scoped lang="scss">
.horse-table-container {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #eee;
    background: #f6e96b;
    padding: 8px;
    border-radius: 4px;
    flex-shrink: 0;
  }
}

.table-scroll-wrapper {
  overflow-y: auto;
  max-height: calc(100% - 60px);
  border: 1px solid #ddd;
  border-radius: 6px;
}

.horse-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.horse-table thead th {
  position: sticky;
  top: 0;
  background: #fafafa;
  z-index: 2;
  border-bottom: 2px solid #ccc;
}

.horse-table th,
.horse-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.color-box {
  width: 18px;
  height: 18px;
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 3px;
}

.empty-state {
  text-align: center;
  color: #777;
  padding: 1rem;
}
</style>
