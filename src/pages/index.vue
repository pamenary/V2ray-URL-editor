<script setup>
import { vmessParseToJson, vlessParseToJson, createVmessString, createVlessString } from '~/utils/parse';
import copy from 'copy-to-clipboard';
import { message } from 'ant-design-vue';

const activeTab = ref('URL')
const URL = ref('')
const config = ref('')
const configName = ref('')
const ipAddresses = ref('')
const output = ref('')
const protocol = ref('')

watch(URL, (newValue) => {
    if (!newValue) return config.value = ''
    const localURL = URL.value.split('://')
    protocol.value = localURL[0]
    if (localURL.length !== 2) return config.value = ''
    switch (protocol.value) {
        case 'vmess':
            config.value = vmessParseToJson(localURL[1])
            break;
        case 'vless':
            config.value = vlessParseToJson(localURL[1])
            break;
    }
    configName.value = 'CDN'
})

const onClick = () => {
    if (!URL.value) return message.error('Please enter a URL');
    if (!ipAddresses.value) return message.error('Please enter IP addresses');
    if (!configName.value) return message.error('Please enter a name');

    const localIpAddresses = ipAddresses.value.split('\n') || []
    output.value = ''
    localIpAddresses.forEach((ip, index) => {
        if (protocol.value === 'vmess') {
            config.value.add = ip
            config.value.ps = `${configName.value}-${index + 1}`
            const encodeConfig = createVmessString(config.value);
            output.value += `${protocol.value}://${encodeConfig}\n\n`
        } else if (protocol.value === 'vless') {
            config.value.address = ip
            config.value.tag = `${configName.value}-${index + 1}`
            const encodeConfig = createVlessString(config.value);
            output.value += `${protocol.value}://${encodeConfig}\n\n`
        }
    });
    copy(activeTab.value);
    activeTab.value = 'output'
    message.success('Copied to the clipboard.');
}
</script>

<template>

    <div class="w-full pb-8">
        <header>
            <h1 class="text-3xl md:text-5xl text-center md:text-left font-bold py-7">V2ray URL editor</h1>
        </header>

        <a-row type="flex" :gutter="{ xs: 0, sm: 25 }">
            <a-col class="mt-5 md:mt-0" :xs="{ span: 24, order: 2 }" :sm="12">
                <a-card>
                    <a-form layout="vertical" v-if="config && typeof config === 'object'">
                        <a-form-item :label="key" :name="key" v-for="(value, key) in config" :key="key">
                            <div class="ml-7" v-if="typeof value === 'object'">
                                <a-form-item :label="keyOption" :name="keyOption"
                                    v-for="(value, keyOption) in config[key]" :key="keyOption">
                                    <a-input v-model:value="config[key][keyOption]" autocomplete="off" />
                                </a-form-item>
                            </div>
                            <template v-else>
                                <a-input v-model:value="config[key]" autocomplete="off" />
                            </template>
                        </a-form-item>

                    </a-form>
                    <a-empty v-else />
                </a-card>
            </a-col>
            <a-col :xs="{ span: 24, order: 1 }" :sm="12">
                <a-card>
                    <a-tabs v-model:activeKey="activeTab" class="mb-4">

                        <a-tab-pane key="URL" tab="URL">
                            <a-form layout="vertical">
                                <a-form-item label="URL" name="URL">
                                    <a-textarea v-model:value="URL" placeholder="URL" :rows="8" />
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>
                        <a-tab-pane key="ip" tab="IP addresses">
                            <a-form layout="vertical">
                                <a-form-item label="IP addresses" name="IP_addresses">
                                    <a-textarea v-model:value="ipAddresses" placeholder="IP addresses" :rows="8" />
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>
                        <a-tab-pane key="output" tab="Output">
                            <a-form layout="vertical">
                                <a-form-item label="Output" name="Output">
                                    <a-textarea v-model:value="output" placeholder="Output" :rows="30" />
                                </a-form-item>
                            </a-form>
                        </a-tab-pane>

                    </a-tabs>

                    <a-form layout="vertical">
                        <a-form-item label="Name" name="name">
                            <a-input v-model:value="configName" autocomplete="off" />
                        </a-form-item>
                        <a-button @click="onClick">Generate</a-button>
                    </a-form>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>