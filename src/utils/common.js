import {
  JWT_ID_TOKEN,
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
  USER_NAME,
  ADMIN_DETAILS,
  PAYMENT_DETAILS,
  ACCESS_CONTROL
} from '../dataProvider/constant';
import $ from 'jquery';
import { browserHistory } from '../components/Routes/headRoute';

export const goBackBrowser = (props, newPath) => {
  let pathname = props.history.location.pathname;
  if (pathname === 'signin' || pathname === 'signin_code' || pathname === 'signup') {
    return;
  } else {
    browserHistory.goBack()
  }
}

export const goBack = (props, newPath) => {
  let pathname = props.history.location.pathname;
  if (pathname === 'signin' || pathname === 'signin_code' || pathname === 'signup') {
    return;
  } else {
    window.location.replace('/dashboard/dashboard')

  }
}

export const abbrivationStr = (text) => {
  let array = text.split(" ", 2)
  if (array.length > 1) {
    let abbr = array[0].charAt(0) + array[1].charAt(0)

    return abbr.toUpperCase();
  } else {
    let abbr = array[0].charAt(0) + array[0].charAt(1)
    return abbr.toUpperCase();
  }
}

/* 
Allow ph no +61nxxxxxxxx or 0nxxxxxxxx where n can be 2, 3, 4, 7, and 
This is 12 chars including +, with the 4th char in [2, 3, 4, 7, 8] 
or 10 chars with the 2nd char in [2, 3, 4, 7, 8].
*/
export const customPhonoeNoValidate = (phone_number) => {
  var substr = ''
  if ((phone_number.startsWith("+61") && phone_number.length === 12)) {
    substr = phone_number.substring(3, 4)
  }

  if ((phone_number.startsWith("0") && phone_number.length === 10)) {
    substr = phone_number.substring(1, 2)
  }

  if ((substr == 2 || substr == 3 || substr == 4 || substr == 7 || substr == 8)) {
    return true //allow phone no
  } else {
    return false //show error
  }
}

export const getStorage = key => {
  // return localStorage.getItem(key);
  return sessionStorage.getItem(key);
}

export const setStorage = (key, value) => {
  // return localStorage.setItem(key, value);
  return sessionStorage.setItem(key, value);
}

export const authRedirect = (history) => {
  if (getStorage(JWT_ID_TOKEN) && getStorage(JWT_ACCESS_TOKEN) && getStorage(JWT_REFRESH_TOKEN)
    && getStorage(USER_NAME) && getStorage(ADMIN_DETAILS) && getStorage(PAYMENT_DETAILS)
    && getStorage(ACCESS_CONTROL)) {
    history.push('/dashboard');
  }
}

export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export const map_to_obj = (aMap => {
  const obj = {};
  aMap.forEach((v, k) => { obj[k] = v });
  return obj;
});

export const countries = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bonaire, Saint Eustatius and Saba (Netherlands Carribean)", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Democratic Republic)", "Congo (Republic)", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "eSwatini (formerly Swaziland)", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana (Guyana)", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Libya", "Liberia", "Liechtenstein", "Lithuania", "Luxemborg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea", "North Macedonia (formerly Macedonia)", "North Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Martin (French Part)", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Soloman Islands", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikstan", "Tanzania", "Timor Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Virgin Islands (British)", "Virgin Islands (US)", "Vatican City", "Venezuela", "Vietnam", "Wallis and Futuna", "Yemen", "Zambia", "Zimbabwe"];

export const zones = ["Perth", "Western Australia", "Northern Territory", "Darwin", "Queensland", "South Australia", "New South Wales", "Adelaide", "Victoria", "Melbourne", "Tasmania", "Hobart", "Canberra", "Sydney", "Brisbane"];

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
];

export const users = [
  {
    name: "Anurag",
    id: 1
  },
  {
    name: "Kalpesh",
    id: 2
  },
  {
    name: "Arish",
    id: 3
  },
  {
    name: "Rupesh",
    id: 4
  },
  {
    name: "Sumeet",
    id: 5
  },
  {
    name: "Ramanath",
    id: 6
  },
  {
    name: "Prasad",
    id: 7
  },
  {
    name: "Vishnu",
    id: 8
  },
  {
    name: "Vishal",
    id: 9
  },
  {
    name: "Samruddhi",
    id: 10
  }
]

export const incidents = [
  {
    name: "Injury",
    id: 1,
  },
  {
    name: "Environment",
    id: 2
  },
  {
    name: "Theft",
    id: 3
  },
  {
    name: "Plant",
    id: 4
  },
  {
    name: "Process",
    id: 5
  },
  {
    name: "Property",
    id: 6
  },
  {
    name: "Drug/Alcohol",
    id: 7
  },
  {
    name: "Security",
    id: 8
  },
  {
    name: "Near Miss",
    id: 9
  },
  {
    name: "Other",
    id: 10
  }
]

export const states = [
  {
    name: "Victoria",
    id: 1
  },
  {
    name: "Tasmania",
    id: 2
  },
  {
    name: "Queensland",
    id: 3
  },
  {
    name: "Northern Territory",
    id: 4
  },
  {
    name: "Maharashtra",
    id: 5
  }
]

export function modifyObject(obj, keyPath, value) {
  let lastKeyIndex = keyPath.length - 1;
  for (var i = 0; i < lastKeyIndex; ++i) {
    let key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = {}
    }
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
}

export function removeByAttr(arr, attr, value) {
  var i = arr.length;
  while (i--) {
    if (arr[i]
      && arr[i].hasOwnProperty(attr)
      && (arguments.length > 2 && arr[i][attr] === value)) {

      arr.splice(i, 1);

    }
  }
  return arr;
}

export function DeepTrim(obj) {
  for (var prop in obj) {
    var value = obj[prop], type = typeof value;
    if (value != null && (type == "string" || type == "object") && obj.hasOwnProperty(prop)) {
      if (type == "object") {
        obj[prop] = DeepTrim(obj[prop]);
      } else {
        obj[prop] = obj[prop].trim();
      }
    }
  }
  return obj;
}

export function currencyFormat(value) {
  var formatedCurrency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'aud' }).format(value)
  return formatedCurrency
}

export const handleFocus = (errors, str) => {
  for (let key in errors) {
    if (typeof errors[key] == 'string') {
      $(str + key + "-focus").focus();
      return str + key;
    } else if (Array.isArray(errors[key]) && errors[key].length > 0) {
      for (let i = 0; i < errors[key].length; i++) {
        if (errors[key][i])
          if (typeof handleFocus(errors[key][i], str + key + "\\[" + i + "\\]\\.") == 'string')
            return handleFocus(errors[key][i], str + key + "\\[" + i + "\\]\\.");
      }
    } else if (typeof errors[key] == "object" && Object.keys(errors[key]).length > 0) {
      if (typeof handleFocus(errors[key], str + key + "\\.") == 'string')
        return handleFocus(errors[key], str + key + "\\.");
    }
  }

}

export const calculateRisk = (likelihood_control, consequence_control) => {
  if (likelihood_control && consequence_control) {
    let key_before_control = "$" + likelihood_control.order + "_" + consequence_control.order
    let resultObj = {
      $1_1: "1. Low",
      $1_2: "2. Low",
      $1_3: "3. Low",
      $1_4: "4. Moderate",
      $1_5: "5. Moderate",

      $2_1: "2. Low",
      $2_2: "4. Moderate",
      $2_3: "6. Moderate",
      $2_4: "8. High",
      $2_5: "10. High",

      $3_1: "3. Low",
      $3_2: "6. Moderate",
      $3_3: "9. High",
      $3_4: "12. Very High",
      $3_5: "15. Very High",

      $4_1: "4. Moderate",
      $4_2: "8. high",
      $4_3: "12. Very High",
      $4_4: "16. Extreme",
      $4_5: "20. Extreme",

      $5_1: "5. Moderate",
      $5_2: "10. High",
      $5_3: "15. Very High",
      $5_4: "20. Extreme",
      $5_5: "25. Extreme"
    }
    return resultObj[key_before_control];

  }
  /* let key_before_control = (likelihood_control_name && consequence_control_name) ? likelihood_control_name.replace(/ /g, "_") + "_" + consequence_control_name.replace(/ /g, "_") : null;

  let resultObj = {
    Almost_Certain_Insignificant: 'Medium',
    Almost_Certain_Minor: 'High',
    Almost_Certain_Moderate: 'High',
    Almost_Certain_Major: 'Extreme',
    Almost_Certain_Severe: 'Extreme',

    Likely_Insignificant: 'Medium',
    Likely_Minor: 'Medium',
    Likely_Moderate: 'High',
    Likely_Major: 'Extreme',
    Likely_Severe: 'Extreme',

    Possible_Insignificant: 'Medium',
    Possible_Minor: 'Medium',
    Possible_Moderate: 'High',
    Possible_Major: 'High',
    Possible_Severe: 'Extreme',

    Unlikely_Insignificant: 'Low',
    Unlikely_Minor: 'Medium',
    Unlikely_Moderate: 'Medium',
    Unlikely_Major: 'High',
    Unlikely_Severe: 'High',

    Rare_Insignificant: 'Low',
    Rare_Minor: 'Low',
    Rare_Moderate: 'Medium',
    Rare_Major: 'High',
    Rare_Severe: 'High',
  }

  return resultObj[key_before_control]; */
}

export const showAsCSV = stringList => {
  return (Array.isArray(stringList) && stringList.length > 0) ? stringList.reduce(((acc, cVal) => acc + ', ' + cVal.area_name), ',').split(',,')[1] : '-'
}

export const resolveDurationToNumber = duration => {
  return parseInt(duration.split('_')[0])
}