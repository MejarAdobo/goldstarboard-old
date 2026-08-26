<script lang="ts">
  import WeatherCondition from "$lib/components/station/WeatherCondition.svelte";
  import { ArrowLeft } from "@lucide/svelte";

  import type { StationData } from "@goldstarboard/shared-types/interfaces";

  let { data }: { data: StationData } = $props();

  let { station, stats, hourly, daily } = $derived(data);
</script>

<svelte:head>
  <title>Station | {station.wuId}</title>
</svelte:head>

<div class="p-3 lg:px-8 lg:py-6">
  <div class="flex flex-col gap-1 lg:gap-4">
    <div class="flex items-center gap-2">
      <ArrowLeft class="text-text h-8 w-8 cursor-pointer" onclick={() => window.history.back()} />
      <h2 class="text-text text-2xl font-semibold lg:text-4xl">
        {station.wuId}
      </h2>
    </div>
    <WeatherCondition hourlyData={hourly} />
  </div>
</div>
