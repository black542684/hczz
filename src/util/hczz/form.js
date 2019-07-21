export default {
  methods: {
    // 表单校验
    submitForm(formName) {
      return this.$refs[formName].validate(valid => {
        if (valid) {
          return true
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
}