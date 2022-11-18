<script setup>
import { ref } from "vue";
import {
  generateTrimmedFileName,
  divideChatLines,
} from "../helpers/utilities.js";

const inputFileOpts = {
  types: [
    {
      description: "Text",
      accept: {
        "text/plain": [".txt"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};
const outputFileOpts = {
  types: [
    {
      description: "Text",
      accept: {
        "text/plain": [".txt"],
      },
    },
  ],
  excludeAcceptAllOption: true,
};
let fileHandle;
let outputFile;

const trimOption = ref("remove-all");
const fullName = ref();
const shortName = ref();

const handleSubmit = async function () {
  [fileHandle] = await window.showOpenFilePicker(inputFileOpts);
  outputFileOpts.suggestedName = generateTrimmedFileName(fileHandle.name);

  const file = await fileHandle.getFile();
  const fileContents = await file.text();
  const dividedChat = divideChatLines(fileContents);

  const newFileHandle = await window.showSaveFilePicker(outputFileOpts);
  let stream = await newFileHandle.createWritable();
  await stream.write(dividedChat.textLines.join("\n"));
  await stream.close();
};
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input
          filled
          v-model="fullName"
          label="Your name"
          hint="As it appears in the Zoom Chat file."
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Please provide your name as it appears in the Zoom Chat file',
          ]"
        />
        <div class="q-pa-md">
          <q-list>
            <p>Select a Trim Option:</p>

            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="trimOption" val="remove-all" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Remove All</q-item-label>
                <q-item-label caption
                  >The prefix line will be completely removed</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="trimOption" val="short-name" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Append my Short Form Name</q-item-label>
                <q-item-label caption
                  >The prefix line will be removed. My shortened name will be
                  appended to lines that I wrote.</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="trimOption" val="long-name" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Append my Name</q-item-label>
                <q-item-label caption
                  >The prefix line will be removed. My full name will be
                  appended o lines that I wrote.
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="trimOption" val="all-names" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Append all Names</q-item-label>
                <q-item-label caption
                  >The prefix line will be removed. The writers name will be
                  appended to all lines.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-input
          filled
          v-model="shortName"
          label="Your Short Form Name"
          hint="Required for Trim Option 2."
        />

        <div>
          <q-btn label="Select file to Trim" type="submit" color="primary" />
        </div>

        <!-- <pre>{{ fullName }}</pre>
        <pre>{{ trimOption }}</pre>
        <pre>{{ shortName }}</pre> -->
      </q-form>
    </div>
  </q-page>
</template>
