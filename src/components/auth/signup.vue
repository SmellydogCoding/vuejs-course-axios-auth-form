<template lang="pug">
  div#signup
    div.signup-form
      form(@submit.prevent="onSubmit")
        div.input(:class="{invalid: $v.email.$error}")
          label(for="email") Mail
          input#email(type="email" v-model="email" @blur="$v.email.$touch()")
          p(v-if="!$v.email.email") Please provide a valid email address
          p(v-if="!$v.email.required") email is required
        div.input(:class="{invalid: $v.age.$error}")
          label(for="age") Your Age
          input#age(type="number" v-model.number="age" @blur="$v.age.$touch()")
          p(v-if="!$v.age.minValue") you must be at least {{ $v.age.$params.minValue.min }} years old
        div.input(:class="{invalid: $v.password.$error}")
          label(for="password") Password
          input#password(type="password" v-model="password" @blur="$v.password.$touch()")
        div.input(:class="{invalid: $v.confirmPassword.$error}")
          label(for="confirm-password") Confirm Password
          input#confirm-password(type="password" v-model="confirmPassword" @blur="$v.confirmPassword.$touch()")
        div.input
          label(for="country") Country
          select#country(v-model="country")
            option(value="usa") USA
            option(value="india") India
            option(value="uk") UK
            option(value="germany") Germany
        div.hobbies
          h3 Add some Hobbies
          button(@click="onAddHobby" type="button") Add Hobby
          div.hobby-list
            div.input(v-for="(hobbyInput, index) in hobbyInputs" :key="hobbyInput.id" :class="{invalid: $v.hobbyInputs.$each[index].$error}")
              label(:for="hobbyInput.id") Hobby # {{ index }}
              input(type="text" :id="hobbyInput.id" v-model="hobbyInput.value" @blur="$v.hobbyInputs.$each[index].value.$touch()")
              button(@click="onDeleteHobby(hobbyInput.id)" type="button") X
        div.input.inline(:class="{invalid: $v.terms.$invalid}")
          input#terms(type="checkbox" v-model="terms" @change="$v.terms.$touch()")
          label(for="terms") Accept Terms of Use
        div.submit
          button(type="submit" :disabled="$v.$invalid") Submit
</template>

<script>
  import { required, email, numeric, minValue, minLength, sameAs, requiredUnless } from 'vuelidate/lib/validators'
  import axios from 'axios'
  export default {
    data () {
      return {
        email: '',
        age: null,
        password: '',
        confirmPassword: '',
        country: 'usa',
        hobbyInputs: [],
        terms: false
      }
    },
    validations: {
      email: {
        required,
        email,
        unique: value => {
          if (value === '') { return true }
          return axios.get('/users.json?orderBy="email"&equalTo="' + value + '"').then((res) => {
            return Object.keys(res.data).length === 0
          })
        }
      },
      age: {
        required,
        numeric,
        minValue: minValue(18)
      },
      password: {
        minLength: minLength(8)
      },
      confirmPassword: {
        sameAs: sameAs('password')
      },
      terms: {
        required: requiredUnless(vm => { return vm.country === 'germany' })
      },
      hobbyInputs: {
        minLength: minLength(2),
        $each: { value: { required, minLength: minLength(3) } }
      }
    },
    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        }
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(hobby => hobby.value),
          terms: this.terms
        }
        this.$store.dispatch('signup', formData)
      }
    }
  }
</script>

<style scoped>
  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }
  
  .input.invalid input {
    border: 1px solid red;
    background-color: #ffc9aa;
  }
  
  .input.invalid label {
    color: red;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>