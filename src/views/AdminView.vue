<script setup>
import { sendLoggedInRequest } from '@/config/backend.js'
import {reactive, ref} from "vue";
import {parseMemberData, roleToInt} from "@/config/member.js";

import Select from "primevue/select"
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import {useUserStore} from "@/store/user.js";
import router from "@/router/router.js";

const loading = ref(false);
const tableLoading = ref(true);


const addUpdateButtonLoading = ref(false);
const editDialogVisible = ref(false);
const editDialogId = ref();
const editDialogName = ref();
const editDialogPassword = ref();
const editDialogRole = ref();
const errorMessage = ref();
const editDialogRoles = ['admin', 'management', 'employee'];
const editDialogButtonText = ref();

const editDialogHeader = ref();


const columns = [{header: 'ID', field: 'userId', sortable: true}, {header: 'Name', field: 'username'}, {header: 'Role', field: 'role', sortable: true}];
let members = ref([]);

function openAddEmployee()
{
  editDialogHeader.value = "Add new employee";
  editDialogVisible.value = true;
  editDialogButtonText.value = "Add employee";

  editDialogId.value = undefined;
  editDialogName.value = '';
  editDialogRole.value = '';
}

function openEditEmployee(openId)
{
  let employeeId = false;
  for (let i = 0; i < members.value.length; i++)
  {
    if (members.value[i].userId === openId)
    {
      employeeId = i;
      break;
    }
  }

  const employee = members.value[employeeId];

  editDialogButtonText.value = "Edit employee";
  editDialogVisible.value = true;
  editDialogHeader.value = "Edit " + employee.username;

  editDialogId.value = employee.userId;
  editDialogName.value = employee.username;
  editDialogRole.value = employee.role;
}

function saveClicked()
{
  let endpoint = "add";

  if (editDialogId.value)
  {
    endpoint = "update";
  }

  addUpdateButtonLoading.value = true;

  sendLoggedInRequest("/" + endpoint, {
    id: editDialogId.value || 0,
    username: editDialogName.value,
    password: editDialogPassword.value,
    role: editDialogRole.value
  }).then(dat => {
    const data = dat.data;

    if (data.error)
    {
      errorMessage.value = data.error;

      setTimeout(() => {
        errorMessage.value = false;
      }, 2.5 * 1000);
    }
    else
    {
      //@TODO Talán mégis jobb újra fetchelni az egész táblát.

      if (data.action === 'add')
      {
        members.value.push({
          userId: data.userId,
          username: editDialogName.value,
          role: editDialogRole.value
        })
      }
      else
      {
        for (let i = 0; i < members.value.length;i++)
        {
          if (members.value[i].userId === data.userId)
          {
            members.value[i].username = editDialogName.value;
            members.value[i].role = editDialogRole.value;
          }
        }
      }
    }
    addUpdateButtonLoading.value = false;
  });
}

function deleteEmployee(employeeId)
{
  let row = false;

  for(let i = 0; i < members.value.length; i++)
  {
    if (members.value[i].userId === employeeId)
    {
      row = i;
      break;
    }
  }

  sendLoggedInRequest('/delete', {
    id: employeeId
  }).then((dat) => {
    const data = dat.data;

    if (data.action === 'delete')
    {
      members.value.splice(members.value.indexOf(employeeId), 1);
    }
  })
}


function fetchMembers()
{
  members.value = [];
  tableLoading.value = true;

  sendLoggedInRequest('/members').then((dat) => {
    const data = dat.data;

    data.forEach((m) => {
      members.value.push(parseMemberData(m));
    })

    tableLoading.value = false;
  });
}

function canEditThisEmployee(role, userId)
{
  const userStore = useUserStore();
  const memberRole = roleToInt(role);

  return userStore.role >= memberRole && userId !== userStore.userId;
}

setTimeout(fetchMembers, 0.25 * 1000);
</script>

<template>
  <div class="centered">
    <Transition mode="out-in">
      <div v-if="loading">
        <ProgressSpinner></ProgressSpinner>
      </div>
      <div v-else-if="!loading" class="crudView">
        <div class="fullWidth">
          <div class="controlButtons">
            <Button class="addButton" @click="openAddEmployee">Add employee</Button>
              <Button icon="pi pi-refresh" class="fullWidth" v-tooltip.top="'Force refresh'" @click="fetchMembers"></Button>
              <Button severity="danger" icon="pi pi-sign-out" class="fullWidth" v-tooltip.top="'Sign out'" @click="useUserStore().logOut()"></Button>
          </div>


          <Dialog modal :header="editDialogHeader" v-model:visible="editDialogVisible">
            <div class="editDialog">
              <Transition name="error" mode="out-in">
                <div v-if="errorMessage" class="editDialogDiv">
                  <Message severity="error">{{errorMessage}}</Message>
                </div>
              </Transition>

              <div class="editDialogDiv">
                <IconField>
                  <InputIcon class="pi pi-database"/>
                  <InputText disabled v-model="editDialogId" placeholder="ID"/>
                </IconField>
              </div>

              <div class="editDialogDiv">
                <IconField>
                  <InputIcon class="pi pi-user"/>
                  <InputText v-model="editDialogName" placeholder="Username"/>
                </IconField>
              </div>

              <div v-if="!editDialogId" class="editDialogDiv">
                <IconField>
                  <InputIcon class="pi pi-lock"/>
                  <InputText type="password" v-model="editDialogPassword" placeholder="Password" />
                </IconField>
              </div>

              <Select class="editDialogDiv" v-model="editDialogRole" :options="editDialogRoles" placeholder="Select role"></Select>

              <Button :loading="addUpdateButtonLoading" class="editDialogDiv" @click="saveClicked">Save</Button>
            </div>
          </Dialog>
        </div>
        <div>
          <DataTable :loading="tableLoading" paginator :rows="10" :rows-per-page-options="[5, 10, 25, 50, 100]" :value="members">
            <Column v-for="col in columns" :field="col.field" :header="col.header" :sortable="col.sortable"></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <div v-if="canEditThisEmployee(slotProps.data.role, slotProps.data.userId)" class="actionButtons">
                  <Button icon="pi pi-user-edit" v-tooltip.top="'Edit'" @click="openEditEmployee(slotProps.data.userId)"></Button>
                  <Button severity="danger" icon="pi pi-user-minus" v-tooltip.top="'Delete'" @click="deleteEmployee(slotProps.data.userId)"></Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>

</style>