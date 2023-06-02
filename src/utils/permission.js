export default function checkPermissionUser(value) {
    if (value.length > 0) {
        const apiList =  this.$store.state.auth.user.apiSet
        //có ít nhất 1 trong các quyền của roles thì trả về true;
        const hasPermission = apiList.some(x => {
          return value.includes(x)
        })
        return hasPermission
      } else {
        return false
      }
}