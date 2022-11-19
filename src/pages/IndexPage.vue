<script setup>
import { ref } from "vue";
import divideChatLines from "../composables/useDivideChatLines.js";
import generateTrimmedFileName from "../composables/useGenerateTrimmedFileName.js";
import handlePrefix from "../composables/useHandlePrefix.js";
import mergeLines from "../composables/useMergeLines.js";
import useLocalStorage from "../composables/useLocalStorage.js";

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
const fullName = ref(useLocalStorage("zct-fullname"));
const shortName = ref(useLocalStorage("zct-shortname"));
const lineNumbers = ref(false);

const handleSubmit = async function () {
  [fileHandle] = await window.showOpenFilePicker(inputFileOpts);
  outputFileOpts.suggestedName = generateTrimmedFileName(fileHandle.name);

  const file = await fileHandle.getFile();
  const fileContents = await file.text();
  let textLines = divideChatLines(fileContents);

  let fileStream = "";
  if (trimOption.value === "remove-all") {
    textLines.forEach((el) => (el.prefix = ""));
  } else if (trimOption.value === "all-names") {
    textLines = handlePrefix(textLines);
  } else if (trimOption.value === "long-name") {
    textLines = handlePrefix(textLines, fullName.value);
    useLocalStorage("zct-fullname", "set", fullName.value);
  } else if (trimOption.value === "short-name") {
    textLines = handlePrefix(textLines, fullName.value, shortName.value);
    useLocalStorage("zct-fullname", "set", fullName.value);
    useLocalStorage("zct-shortname", "set", shortName.value);
  }
  fileStream = mergeLines(textLines, lineNumbers.value);

  const newFileHandle = await window.showSaveFilePicker(outputFileOpts);
  let stream = await newFileHandle.createWritable();
  await stream.write(fileStream);
  await stream.close();
};
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="q-pa-md">
          <q-list>
            <p class="text-weight-bold">Select a Trimmer Option:</p>

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
                <q-radio v-model="trimOption" val="all-names" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Prefix all Names</q-item-label>
                <q-item-label caption
                  >The prefix line will be removed. The writer's name will be
                  prepended to each line.</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="trimOption" val="long-name" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Prefix only my Name</q-item-label>
                <q-item-label caption
                  >The prefix line will be removed. Your name will be prepended
                  to lines that you wrote.
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="trimOption" val="short-name" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Prefix my Short Form Name</q-item-label>
                <q-item-label caption
                  >The prefix line will be removed. Your shortened name will be
                  prepended to lines that you wrote.</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-input
          filled
          v-if="trimOption === 'short-name' || trimOption === 'long-name'"
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
        <q-input
          filled
          v-if="trimOption === 'short-name' && fullName"
          v-model="shortName"
          label="Your Short Form Name"
          hint="Required for Trim Option 4."
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Please provide your abbreviated name or initials for the output file',
          ]"
        />
        <div>
          <q-checkbox v-model="lineNumbers" label="Add Line Numbers" />
        </div>

        <div>
          <q-btn label="Select file to Trim" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>
