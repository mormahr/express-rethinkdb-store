module.exports = {
	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module"
	},
	"env": {
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"strict": [
			"warn",
			"global"
		],
		"valid-typeof": [
			"error"
		],
		"no-console": [
			"off"
		],
		"no-unreachable": [
			"error"
		],
		"no-shadow": [
			"error"
		],
		"no-shadow-restricted-names": [
			"error"
		],
		"no-use-before-define": [
			"error"
		],
		"no-undef": [
			"error"
		],
		"brace-style": [
			"error",
			"1tbs"
		],
		"curly": [
			"error",
			"all"
		],
		"comma-dangle": [
			"warn",
			"only-multiline"
		],
	}
};
