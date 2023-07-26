<script setup>
import GlobalLayout from '@/layouts/GlobalLayout.vue'
import { watch } from 'vue'
import { computed } from 'vue'
import { ref } from 'vue'
import api from '@/services/api'
import { useMessageStore } from '@/stores/message'

const messageStore = useMessageStore()

const headers = [
  { title: 'タイトル', align: 'start', sortable: false, key: 'title' },
  { title: '価格', key: 'price' },
  { title: '作成日時', key: 'created_at' },
  { title: '', key: 'actions', sortable: false }
]
const defaultItem = {
  id: undefined,
  title: '',
  price: 0,
  created_at: ''
}

const loading = ref(false)
const dialog = ref(false)
const dialogDelete = ref(false)
const items = ref([])
const editedItem = ref({
  id: undefined,
  title: '',
  price: 0,
  created_at: ''
})

const isCreated = computed(() => {
  return editedItem.value.id === undefined
})

const formTitle = computed(() => {
  return isCreated.value ? '新規作成' : '更新'
})

watch(dialog, (val) => {
  val || close()
})
watch(dialogDelete, (val) => {
  val || closeDelete()
})

const initialize = async () => {
  loading.value = true
  try {
    const response = await api({
      method: 'get',
      url: '/books/'
    })
    items.value = response.data
  } catch (e) {
    messageStore.setError(e)
  } finally {
    loading.value = false
  }
}

const editItem = (item) => {
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}
const deleteItem = (item) => {
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}
const deleteItemConfirm = async () => {
  try {
    await api({
      method: 'delete',
      url: `/books/${editedItem.value.id}`
    })
    items.value = items.value.filter((item) => item.id !== editedItem.value.id)
    messageStore.setInfoMessage('削除しました。')
    closeDelete()
  } catch (e) {
    messageStore.setError(e)
  }
}
const close = async () => {
  editedItem.value = Object.assign({}, defaultItem)
  dialog.value = false
}
const closeDelete = async () => {
  editedItem.value = Object.assign({}, defaultItem)
  dialogDelete.value = false
}

const save = async () => {
  const method = isCreated.value ? 'post' : 'put'
  const url = isCreated.value ? '/books/' : `/books/${editedItem.value.id}/`
  try {
    const response = await api({
      method: method,
      url: url,
      data: editedItem.value
    })

    if (isCreated.value) {
      items.value.push(response.data)
    } else {
      const index = items.value.findIndex((item) => item.id === response.data.id)
      Object.assign(items.value[index], response.data)
    }

    messageStore.setInfoMessage(`${formTitle.value}しました。`)
    close()
  } catch (e) {
    messageStore.setError(e)
  }
}

initialize()
</script>

<template>
  <GlobalLayout>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="items"
        :sort-by="[{ key: 'created_at', order: 'desc' }]"
        :loading="loading"
        class="elevation-4"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>書籍一覧</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" dark class="mb-2" v-bind="props"> 新規追加 </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-text-field v-model="editedItem.title" label="タイトル"></v-text-field>
                    <v-text-field v-model="editedItem.price" label="価格"></v-text-field>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close"> Cancel </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">削除してもよろしいですか?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-2" @click="editItem(item.raw)"> mdi-pencil </v-icon>
          <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </GlobalLayout>
</template>
