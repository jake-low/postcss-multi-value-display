module.exports = {
	"basic": {
		message: "supports basic usage"
	},
	"preserve-true": {
		message: "supports { preserve: true } usage",
		options: {
			preserve: true
		}
	},
	"warn-on-unsupported": {
		message: "issues warning when unable to transform syntax",
		warnings: 2
	}
}
