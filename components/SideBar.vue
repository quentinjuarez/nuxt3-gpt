<template>
  <div class="bg-cool-100 dark:bg-cool-950 sticky bottom-0 top-0 h-screen w-72 flex-none">
    <div class="flex h-full flex-col justify-between">
      <div class="">
        <AppLogo />
        <hr class="my-2" />
        <TemplateList />
        <hr class="my-2" />
        <ConversationList />
      </div>

      <UserMenu />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
