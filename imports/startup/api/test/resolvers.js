import Vehicles from '../vehicle/vehicles';
import Licences from '../licence/licences';
import Entretiens from '../entretien/entretiens';
import Batiments from '../batiment/batiments';
import Accidents from '../accident/accidents';
import { Mongo } from 'meteor/mongo';
import Vehicle from '../../../ui/pages/Vehicle';

const data = [
	{
		"_id": "006bc7978984a8a2ae7ad84f",
		"registration": "FM-463-JG",
		"kms": [
			{
				"_id": {
					"$oid": "11b1aaded98f9e7b68170dc9"
				},
				"kmValue": {
					"$numberInt": "13874"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":427.17,
		"payementTime": ""
	},
	{
		"_id": "013bf19174ce6730bf6e1a25",
		"registration": "DE-342-TB",
		"kms": [
			{
				"_id": {
					"$oid": "76efd5455c7c9b38d95c1b93"
				},
				"kmValue": {
					"$numberInt": "270000"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":509.97,
		"payementTime": ""
	},
	{
		"_id": "028552f5958ab74dcc431c0d",
		"registration": "DY-160-RB",
		"kms": [
			{
				"_id": {
					"$oid": "444316527973c8d14273a69e"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "0287c08f4655f700ca846e5a",
		"registration": "FD-986-SW",
		"kms": [
			{
				"_id": {
					"$oid": "0c34df48846fa1da5a123df0"
				},
				"kmValue": {
					"$numberInt": "43035"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":368.62,
		"payementTime": ""
	},
	{
		"_id": "038a18e8f6917d9c76dd66df",
		"registration": "ED-758-RF",
		"kms": [
			{
				"_id": {
					"$oid": "cecd8b5e5e397cea1f62e44e"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "01/07/2016"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "0421bb10c7f545cd30d25964",
		"registration": "DF-439-AF",
		"kms": [
			{
				"_id": {
					"$oid": "670de901d95b12a92b45526a"
				},
				"kmValue": {
					"$numberInt": "426000"
				},
				"reportDate": "31/01/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "058c52fcc55a87c1156ec340",
		"registration": "EK-278-TH",
		"kms": [
			{
				"_id": {
					"$oid": "bf5fe7a610c7909330db2e43"
				},
				"kmValue": {
					"$numberInt": "60200"
				},
				"reportDate": "16/04/2020"
			}
		],
		"monthlyPayement":421.79,
		"payementTime": ""
	},
	{
		"_id": "06c62379063feeb0333f47cb",
		"registration": "FE-375-JE",
		"kms": [
			{
				"_id": {
					"$oid": "a5b17797b2f53ca80b3a46ca"
				},
				"kmValue": {
					"$numberInt": "69492"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":605.32,
		"payementTime": ""
	},
	{
		"_id": "06db6b571429fba67819d8a3",
		"registration": "EN-914-ZX",
		"kms": [
			{
				"_id": {
					"$oid": "0b0601d0b31098ff16f693a7"
				},
				"kmValue": {
					"$numberInt": "68900"
				},
				"reportDate": "30/01/2020"
			}
		],
		"monthlyPayement":463.97,
		"payementTime": ""
	},
	{
		"_id": "07ac8246e618c71fe6a33c84",
		"registration": "EW-211-NN",
		"kms": [
			{
				"_id": {
					"$oid": "ce4ce6f6a2e392b2e4f57e08"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "0add46eaf705f21352e090f4",
		"registration": "EN-861-EL",
		"kms": [
			{
				"_id": {
					"$oid": "c382aa2e17804af6aebb73a4"
				},
				"kmValue": {
					"$numberInt": "71318"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "0b9fc85568fd448169a0d72d",
		"registration": "EL-951-XL",
		"kms": [
			{
				"_id": {
					"$oid": "d8a73287385cea9a6d62e140"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "24/08/2017"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "0d29d0204e717d3ba2fa372c",
		"registration": "EP-149-ZX",
		"kms": [
			{
				"_id": {
					"$oid": "d3d01f1b6d0c119b093cc2a9"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "23/08/2017"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "0d9eb60a37c0a3c34c0763b2",
		"registration": "FJ-224-DR",
		"kms": [
			{
				"_id": {
					"$oid": "9a91e322b9d5022854b51cb0"
				},
				"kmValue": {
					"$numberInt": "80648"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":388.905,
		"payementTime": ""
	},
	{
		"_id": "0fc7d2065ace2e27284a37db",
		"registration": "EK-874-MM",
		"kms": [
			{
				"_id": {
					"$oid": "00113c7711a8775314e148c3"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "118d5e82374dc828a621ff51",
		"registration": "DA-465-JE",
		"kms": [
			{
				"_id": {
					"$oid": "8ae777bfcfc2a11bb1355710"
				},
				"kmValue": {
					"$numberInt": "250211"
				},
				"reportDate": "15/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "12a785361edeb3a4562ebc91",
		"registration": "CK-307-MB",
		"kms": [
			{
				"_id": {
					"$oid": "547ec146a3a1a8d7f97455eb"
				},
				"kmValue": {
					"$numberInt": "332027"
				},
				"reportDate": "23/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "158d126b474da16bd6871804",
		"registration": "BR-345-AM",
		"kms": [
			{
				"_id": {
					"$oid": "294a7573f683e50c91e36636"
				},
				"kmValue": {
					"$numberInt": "336354"
				},
				"reportDate": "15/10/2019"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "15c96cef1ebca8f1b1ccee9b",
		"registration": "EK-870-MM",
		"kms": [
			{
				"_id": {
					"$oid": "f71c9e844a6977fe8491b258"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "16267cdbd657ec75c03f4d73",
		"registration": "EL-836-PY",
		"kms": [
			{
				"_id": {
					"$oid": "43fee9efebde62e13113efcc"
				},
				"kmValue": {
					"$numberInt": "16450"
				},
				"reportDate": "10/04/2020"
			},
			{
				"_id": {
					"$oid": "59a055423af5d20b4ee8cd20"
				},
				"reportDate": "10/03/2020",
				"kmValue": {
					"$numberInt": "48667"
				}
			},
			{
				"_id": {
					"$oid": "2119ee1891f8feed5c8e8d05"
				},
				"reportDate": "10/04/2020",
				"kmValue": {
					"$numberInt": "48667"
				}
			}
		],
		"monthlyPayement":1,
		"km": {
			"$numberInt": "48667"
		},
		"lastKmUpdate": "10/04/2020",
		"payementTime": ""
	},
	{
		"_id": "1b19d42245bdc4e359df4de1",
		"registration": "DB-889-HP",
		"kms": [
			{
				"_id": {
					"$oid": "ca8f9046a50df0d449a257a5"
				},
				"kmValue": {
					"$numberInt": "217125"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "1b923b26d0da74a17b68e339",
		"registration": "EH-541-CM",
		"kms": [
			{
				"_id": {
					"$oid": "5ac2d6308c0f1e16d570bf5c"
				},
				"kmValue": {
					"$numberInt": "171939"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":449.36,
		"payementTime": ""
	},
	{
		"_id": "1c76a03b94b9d075d1dc64c4",
		"registration": "DL-405-AM",
		"kms": [
			{
				"_id": {
					"$oid": "4b2a1667bfa67995110aec24"
				},
				"kmValue": {
					"$numberInt": "251250"
				},
				"reportDate": "16/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "1f546929e0d7b0a455cc40e5",
		"registration": "3",
		"kms": [
			{
				"_id": {
					"$oid": "dac5959e53c12c8e27e5a5ca"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "01/01/2018"
			}
		],
		"monthlyPayement":0.08,
		"payementTime": "598cfbf8c12ca586119f6e0f"
	},
	{
		"_id": "21af7cd3f122a787f009c98a",
		"registration": "DB-625-ZQ",
		"kms": [
			{
				"_id": {
					"$oid": "aab22af64078a559e9c5bbe4"
				},
				"kmValue": {
					"$numberInt": "290321"
				},
				"reportDate": "20/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "230b9a67f63b9489fd62cb0e",
		"registration": "ES-431-TB",
		"kms": [
			{
				"_id": {
					"$oid": "746a0dfb0ed92a0a46b558ca"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "23bdd3858b66c9fd2c5e9dc4",
		"registration": "BR-233-AN",
		"kms": [
			{
				"_id": {
					"$oid": "caf27f1b29e9acd2c400cea6"
				},
				"kmValue": {
					"$numberInt": "270210"
				},
				"reportDate": "02/10/2019"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "247f82326995cc3dde74af12",
		"registration": "BY-382-LE",
		"kms": [
			{
				"_id": {
					"$oid": "abf82f1efbb77046823d8a41"
				},
				"kmValue": {
					"$numberInt": "173000"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "28a5c7e3f9a00221fb79a1b9",
		"registration": "EH-944-CK",
		"kms": [
			{
				"_id": {
					"$oid": "47ff0d7608f7108a61a2c631"
				},
				"kmValue": {
					"$numberInt": "137802"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":449.36,
		"payementTime": ""
	},
	{
		"_id": "29565c0d9e57a073bdc50052",
		"registration": "AR-017-MS",
		"kms": [
			{
				"_id": {
					"$oid": "5c34164acabdb108088cac66"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "22/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "2a5199445e72875f04e04c0b",
		"registration": "DX-814-PN",
		"kms": [
			{
				"_id": {
					"$oid": "3754e73b209786861ca0342c"
				},
				"kmValue": {
					"$numberInt": "207551"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "2b3c164676f1f596790b6f66",
		"registration": "EQ-986-SV",
		"kms": [
			{
				"_id": {
					"$oid": "a27bb574520489c40e844786"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "19/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "2e28a0b59e8beed67addcd0d",
		"registration": "4",
		"kms": [
			{
				"_id": {
					"$oid": "6e8b1808044470f14909f19c"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "01/01/2018"
			}
		],
		"monthlyPayement":0.08,
		"payementTime": "598cfbf8c12ca586119f6e0f"
	},
	{
		"_id": "327314bf27a8c84aca068e14",
		"registration": "DZ-248-AS",
		"kms": [
			{
				"_id": {
					"$oid": "dfa720e3c1ffcccad4b7364a"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/01/2016"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "361ca257e335fb4b41f66394",
		"registration": "FD-396-TM",
		"kms": [
			{
				"_id": {
					"$oid": "e6b7d6cc7e4feba0558bcc89"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "384dc2464b56649d9ae3dcf8",
		"registration": "FF-124-CP",
		"kms": [
			{
				"_id": {
					"$oid": "5655f757836faf99619aa2a6"
				},
				"kmValue": {
					"$numberInt": "55369"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":726.38,
		"payementTime": ""
	},
	{
		"_id": "3b395c2bf96f8be9dc34b485",
		"registration": "ES-043-AC",
		"kms": [
			{
				"_id": {
					"$oid": "a8f9db45435ece41c13d2864"
				},
				"kmValue": {
					"$numberInt": "69420"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":315.06,
		"payementTime": ""
	},
	{
		"_id": "3c1448031207675f23009a0c",
		"registration": "FD-003-SX",
		"kms": [
			{
				"_id": {
					"$oid": "01fb0521cc2fa4a66069e7cf"
				},
				"kmValue": {
					"$numberInt": "52800"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":368.62,
		"payementTime": ""
	},
	{
		"_id": "41b7dc0d7c6294e6cc480c01",
		"registration": "EE-123-YQ",
		"kms": [
			{
				"_id": {
					"$oid": "3d1952e672f0fe09896ef514"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "01/09/2016"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "43470c9d6c191ac6afcf5442",
		"registration": "FC-370-YE",
		"kms": [
			{
				"_id": {
					"$oid": "aecd196602e5b4fe179e6cb5"
				},
				"kmValue": {
					"$numberInt": "90000"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":558.35,
		"payementTime": ""
	},
	{
		"_id": "438fa1b18935ba8770be9457",
		"registration": "CX-774-JF",
		"kms": [
			{
				"_id": {
					"$oid": "ebdf8ff6346c12798e4905e9"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "22/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "4392712084b0163cdf050e7d",
		"registration": "ER-038-PS",
		"kms": [
			{
				"_id": {
					"$oid": "d4baf2b2fa9b8f1588840286"
				},
				"kmValue": {
					"$numberInt": "322500"
				},
				"reportDate": "29/01/2020"
			}
		],
		"monthlyPayement":746.91,
		"payementTime": ""
	},
	{
		"_id": "461c60320883b20f77eb06cc",
		"registration": "FF-904-KP",
		"kms": [
			{
				"_id": {
					"$oid": "5bde8933cf7a7a2aea0e60cc"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "47a4a21c71dc2f10e0b1da46",
		"registration": "BM-132-NA",
		"kms": [
			{
				"_id": {
					"$oid": "c516dda0a8359ee0bc258182"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "19/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "4e35ca23990329c94c9bba04",
		"registration": "CE-191-FQ",
		"kms": [
			{
				"_id": {
					"$oid": "4c39c61a8d8e08090ab5d106"
				},
				"kmValue": {
					"$numberInt": "281143"
				},
				"reportDate": "15/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "4efe4806ff63729b2133847b",
		"registration": "EC-394-SX",
		"kms": [
			{
				"_id": {
					"$oid": "79aaae94d174349046a9293c"
				},
				"kmValue": {
					"$numberInt": "226496"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "4f3e29253d7d98bdcce4bf2b",
		"registration": "BC-365-ZW",
		"kms": [
			{
				"_id": {
					"$oid": "31bfda39ddfd4bcad69a9ada"
				},
				"kmValue": {
					"$numberInt": "486800"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "502db382cbcaf07a5b39c0ef",
		"registration": "CD-960-WP",
		"kms": [
			{
				"_id": {
					"$oid": "6c41083b2c071e0b5a4693ff"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "19/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "5047891402413237f202e5c3",
		"registration": "FE-958-JD",
		"kms": [
			{
				"_id": {
					"$oid": "ac0d6ee01f95d72671c940a1"
				},
				"kmValue": {
					"$numberInt": "60423"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":605.32,
		"payementTime": ""
	},
	{
		"_id": "53d3808e6227ae7f50b9ac0b",
		"registration": "ES-340-TT",
		"kms": [
			{
				"_id": {
					"$oid": "9fbe264962f2ef1fc244baf7"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "5586464013de8eafe10e1f1c",
		"registration": "EW-308-PS",
		"kms": [
			{
				"_id": {
					"$oid": "571acdb4ff53a5768084906e"
				},
				"kmValue": {
					"$numberInt": "15220"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":830.925,
		"payementTime": ""
	},
	{
		"_id": "57d3571a153ba02627ef4cd3",
		"registration": "DM-989-MC",
		"kms": [
			{
				"_id": {
					"$oid": "6c0c496a0d8307a60464412b"
				},
				"kmValue": {
					"$numberInt": "214542"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "5a9978c83c9e807a87724552",
		"registration": "DT-077-LY",
		"kms": [
			{
				"_id": {
					"$oid": "5bfa884d59ead96b89435cce"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "19/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "5b5ff20a5ea9d744d99b3123",
		"registration": "DX-341-PP",
		"kms": [
			{
				"_id": {
					"$oid": "6d6998f18b9839495bd94530"
				},
				"kmValue": {
					"$numberInt": "170556"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":442.6,
		"payementTime": ""
	},
	{
		"_id": "5deb170ad9e3a7312ef62ff1",
		"registration": "EH-581-FT",
		"kms": [
			{
				"_id": {
					"$oid": "a5f772b41a1e4feaf89d8b6e"
				},
				"kmValue": {
					"$numberInt": "205803"
				},
				"reportDate": "28/07/2018"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "5ef5a1778762e28cb6183d26",
		"registration": "EN-034-RB",
		"kms": [
			{
				"_id": {
					"$oid": "30fa4aa656d4098a08970ac8"
				},
				"kmValue": {
					"$numberInt": "48970"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":525.02,
		"payementTime": ""
	},
	{
		"_id": "6547ed2249342a408b736870",
		"registration": "BW-815-QA",
		"kms": [
			{
				"_id": {
					"$oid": "f47c7742225584607ed06827"
				},
				"kmValue": {
					"$numberInt": "195684"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "6580ca22567330580f60e1f1",
		"registration": "FD-773-FQ",
		"kms": [
			{
				"_id": {
					"$oid": "794eeb8d6e34ea9d70c53c63"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "65e1ac2c3fe14bfc97943ccc",
		"registration": "DY-161-RB",
		"kms": [
			{
				"_id": {
					"$oid": "2bd16204ea6a3abde5862af6"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "6690bdfd0ef3f6a30d29d56a",
		"registration": "EN-945-GE",
		"kms": [
			{
				"_id": {
					"$oid": "b1eadd9755527bae709f4593"
				},
				"kmValue": {
					"$numberInt": "79140"
				},
				"reportDate": "23/03/2020"
			}
		],
		"monthlyPayement":432.34,
		"payementTime": ""
	},
	{
		"_id": "6698034c45a57af9b9bac7db",
		"registration": "CK-969-NN",
		"kms": [
			{
				"_id": {
					"$oid": "94435f3f0e80c438df8ab509"
				},
				"kmValue": {
					"$numberInt": "266270"
				},
				"reportDate": "30/03/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "66ee571d00e828b772bb411e",
		"registration": "BP-354-CY",
		"kms": [
			{
				"_id": {
					"$oid": "7f637102f7b3727ea9de3f49"
				},
				"kmValue": {
					"$numberInt": "350000"
				},
				"reportDate": "03/01/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "6792060e88d48fdd295009dd",
		"registration": "FD-660-FT",
		"kms": [
			{
				"_id": {
					"$oid": "07bc8857367457a380c5e20c"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "6ca98447f014e9396c29adb7",
		"registration": "FE-531-JD",
		"kms": [
			{
				"_id": {
					"$oid": "1eaa697af1c9c4ddf41a51da"
				},
				"kmValue": {
					"$numberInt": "41433"
				},
				"reportDate": "15/04/2020"
			}
		],
		"monthlyPayement":726.38,
		"payementTime": ""
	},
	{
		"_id": "6d2c923509127190bfd8b96e",
		"registration": "EC-487-SX",
		"kms": [
			{
				"_id": {
					"$oid": "fc2be8573d009e378cd7e887"
				},
				"kmValue": {
					"$numberInt": "210000"
				},
				"reportDate": "20/02/2019"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "6eadc848985ec0b4edad4c13",
		"registration": "FE-189-JE",
		"kms": [
			{
				"_id": {
					"$oid": "d196cc1ff86e35b5a78c38ca"
				},
				"kmValue": {
					"$numberInt": "42803"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":605.32,
		"payementTime": ""
	},
	{
		"_id": "6ee1a2f3ba5c225468642f89",
		"registration": "ER-964-PR",
		"kms": [
			{
				"_id": {
					"$oid": "543da267fd55ce645c8c58ed"
				},
				"kmValue": {
					"$numberInt": "199700"
				},
				"reportDate": "23/03/2020"
			}
		],
		"monthlyPayement":721.69,
		"payementTime": ""
	},
	{
		"_id": "710e596bce18bdd4a7c52e0b",
		"registration": "EP-206-VH",
		"kms": [
			{
				"_id": {
					"$oid": "6370f311e32a80d7d56372b0"
				},
				"kmValue": {
					"$numberInt": "49169"
				},
				"reportDate": "20/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "716cf734a9e813668e15d887",
		"registration": "EH-735-JH",
		"kms": [
			{
				"_id": {
					"$oid": "60dbf8014c237adefa837aa6"
				},
				"kmValue": {
					"$numberInt": "301460"
				},
				"reportDate": "23/03/2020"
			}
		],
		"monthlyPayement":585.5,
		"payementTime": ""
	},
	{
		"_id": "72414a41da597b337265edf3",
		"registration": "FD-018-SX",
		"kms": [
			{
				"_id": {
					"$oid": "eba40034701390be3c2b5adc"
				},
				"kmValue": {
					"$numberInt": "54028"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":368.62,
		"payementTime": ""
	},
	{
		"_id": "732f43d15fefc2351cd78fa3",
		"registration": "EM-418-KD",
		"kms": [
			{
				"_id": {
					"$oid": "5503304c2d1767bc9c111219"
				},
				"kmValue": {
					"$numberInt": "42482"
				},
				"reportDate": "15/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "75cffa3df82939de57ea37a1",
		"registration": "BN-666-RT",
		"kms": [
			{
				"_id": {
					"$oid": "fc6ae9a7032505178497c32c"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "19/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "766892089fbf3dbb150c0ffd",
		"registration": "DB-352-ZR",
		"kms": [
			{
				"_id": {
					"$oid": "e3d887bc12ec9c9ee63da53d"
				},
				"kmValue": {
					"$numberInt": "289111"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "7750903ee4822f1738e8e517",
		"registration": "EQ-748-XH",
		"kms": [
			{
				"_id": {
					"$oid": "2555172c5c5cfba78d2044b0"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "19/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "77898d6663a721cc01060bdd",
		"registration": "EE-171-JQ",
		"kms": [
			{
				"_id": {
					"$oid": "4945dac1cf4e4afc2fbbfcc7"
				},
				"kmValue": {
					"$numberInt": "158380"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "79cb829c668b30bec342baef",
		"registration": "DY-162-RB",
		"kms": [
			{
				"_id": {
					"$oid": "d85d1bba876918d472768ba8"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "7a445b4b6d4bbf5e3c73798d",
		"registration": "EK-076-TH",
		"kms": [
			{
				"_id": {
					"$oid": "517656a7314242aea6bd160a"
				},
				"kmValue": {
					"$numberInt": "58660"
				},
				"reportDate": "16/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "7ad15994c860a9cf44ff5177",
		"registration": "FC-193-ZH",
		"kms": [
			{
				"_id": {
					"$oid": "ddb659ec202cbc9d9ec57743"
				},
				"kmValue": {
					"$numberInt": "195930"
				},
				"reportDate": "20/03/2020"
			}
		],
		"monthlyPayement":596.95,
		"payementTime": ""
	},
	{
		"_id": "7b4530198fb4d4e03e177e5b",
		"registration": "CF-087-FR",
		"kms": [
			{
				"_id": {
					"$oid": "f5b54cfaf2289ad4fd20448e"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "7b9aafd4f5ebbc7467ceabe9",
		"registration": "EH-208-CM",
		"kms": [
			{
				"_id": {
					"$oid": "c8e8f613e0085956e873fd8f"
				},
				"kmValue": {
					"$numberInt": "138114"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":449.36,
		"payementTime": ""
	},
	{
		"_id": "7c209addb3fee8a8d6323cfc",
		"registration": "ER-107-PS",
		"kms": [
			{
				"_id": {
					"$oid": "c43bdc8e98c94af8db708007"
				},
				"kmValue": {
					"$numberInt": "184896"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "84b0698f1facd365a2a425e1",
		"registration": "ER-997-PR",
		"kms": [
			{
				"_id": {
					"$oid": "93dc0041a5f0f916f31bcf58"
				},
				"kmValue": {
					"$numberInt": "272800"
				},
				"reportDate": "27/01/2020"
			}
		],
		"monthlyPayement":746.9,
		"payementTime": ""
	},
	{
		"_id": "84c09edbcb7cbe332023fdb9",
		"registration": "BR-250-AP",
		"kms": [
			{
				"_id": {
					"$oid": "ba1d256f334a59a24c331e40"
				},
				"kmValue": {
					"$numberInt": "300680"
				},
				"reportDate": "23/03/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "866fb7131378e4abc64daae8",
		"registration": "BT-242-WV",
		"kms": [
			{
				"_id": {
					"$oid": "f7fff6fc492e615ae37cad4a"
				},
				"kmValue": {
					"$numberInt": "224426"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":0,
		"payementTime": ""
	},
	{
		"_id": "86d4434cb249a5760d4af601",
		"registration": "ES-491-TB",
		"kms": [
			{
				"_id": {
					"$oid": "8e273fa4d90baf9a15503cd4"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "870dc653bc1e009f4fb55ec1",
		"registration": "ER-053-AA",
		"kms": [
			{
				"_id": {
					"$oid": "17b8057af0f152bb6a4c3c7d"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "19/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "879c05b4b9cb00febadad149",
		"registration": "ER-815-PR",
		"kms": [
			{
				"_id": {
					"$oid": "5f9a51b909ee66e8b771391d"
				},
				"kmValue": {
					"$numberInt": "215200"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "879edbf0d9bddaceb060819c",
		"registration": "FC-406-YE",
		"kms": [
			{
				"_id": {
					"$oid": "a8f75bc9c2def41bf2d82711"
				},
				"kmValue": {
					"$numberInt": "56515"
				},
				"reportDate": "23/03/2020"
			}
		],
		"monthlyPayement":558.35,
		"payementTime": ""
	},
	{
		"_id": "8abaeec1d3bcfabc46dad74c",
		"registration": "EQ-683-AD",
		"kms": [
			{
				"_id": {
					"$oid": "28b8f15d55b0ce16447dad41"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "13/05/2020"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "8db896a2dfb8a7aaf351ba72",
		"registration": "BW-973-PA",
		"kms": [
			{
				"_id": {
					"$oid": "46a2994dbc680368a212e053"
				},
				"kmValue": {
					"$numberInt": "265927"
				},
				"reportDate": "19/08/2019"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "8e611c642f6bcd60f31942ef",
		"registration": "DH-644-DZ",
		"kms": [
			{
				"_id": {
					"$oid": "981491bab285e9a40afc357b"
				},
				"kmValue": {
					"$numberInt": "193526"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "9030c759a647678c30944344",
		"registration": "FF-698-LN",
		"kms": [
			{
				"_id": {
					"$oid": "ab0aac56fa8bd94a81a1ec6e"
				},
				"kmValue": {
					"$numberInt": "53341"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":443.03,
		"payementTime": ""
	},
	{
		"_id": "94b00607af6c41f73c1c34e2",
		"registration": "CS-256-FE",
		"kms": [
			{
				"_id": {
					"$oid": "10424ea2824952bda6e60a0e"
				},
				"kmValue": {
					"$numberInt": "334057"
				},
				"reportDate": "15/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "94deb0403a6fbaad5cafeb69",
		"registration": "DX-933-PM",
		"kms": [
			{
				"_id": {
					"$oid": "88ee289eef1510233a43bbfd"
				},
				"kmValue": {
					"$numberInt": "140151"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "94e1fdf94d488ea8e6115d10",
		"registration": "FF-809-LN",
		"kms": [
			{
				"_id": {
					"$oid": "fc7b3acb00c82b76669b3100"
				},
				"kmValue": {
					"$numberInt": "49491"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":443.03,
		"payementTime": ""
	},
	{
		"_id": "9cd101a32ddb7acde451e5b9",
		"registration": "FF-968-KP",
		"kms": [
			{
				"_id": {
					"$oid": "a898b4f2589481aba0bb8ca7"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "9d1161600792e1c922cd2605",
		"registration": "FM-854-JG",
		"kms": [
			{
				"_id": {
					"$oid": "0ba1be4cbd7a4c1be8815d16"
				},
				"kmValue": {
					"$numberInt": "18305"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":427.17,
		"payementTime": ""
	},
	{
		"_id": "9f6cb9bb225cbd66b95019a1",
		"registration": "EH-071-CM",
		"kms": [
			{
				"_id": {
					"$oid": "40d24081264b48d52e73374f"
				},
				"kmValue": {
					"$numberInt": "127290"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":449.36,
		"payementTime": ""
	},
	{
		"_id": "a1fb5a32f86006c74c5e0bae",
		"registration": "BC-737-TN",
		"kms": [
			{
				"_id": {
					"$oid": "7556eaf06fd39fdecfdc6997"
				},
				"kmValue": {
					"$numberInt": "293533"
				},
				"reportDate": "04/02/2019"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "a4f7988ed6a51c7a4db0c43a",
		"registration": "2",
		"kms": [
			{
				"_id": {
					"$oid": "75137dff066229126872c329"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "01/01/2018"
			}
		],
		"monthlyPayement":2.78,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "a5aefe762394196244ce4945",
		"registration": "FJ-279-DR",
		"kms": [
			{
				"_id": {
					"$oid": "b5f52b0a43b3115b221e7fc3"
				},
				"kmValue": {
					"$numberInt": "29266"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":388.905,
		"payementTime": ""
	},
	{
		"_id": "af10d8622f7164f12b4650e8",
		"registration": "EN-884-SY",
		"kms": [
			{
				"_id": {
					"$oid": "39ebbfadaed2bd4b0bec928e"
				},
				"kmValue": {
					"$numberInt": "59447"
				},
				"reportDate": "16/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "b13907ab89a54e6ffd1243fd",
		"registration": "AR-017-MS",
		"kms": [
			{
				"_id": {
					"$oid": "b7f92e39c022351c7f9acb35"
				},
				"kmValue": {
					"$numberInt": "100000"
				},
				"reportDate": "25/02/2020"
			},
			{
				"_id": {
					"$oid": "79ed543378644e1bc1ad8fc3"
				},
				"reportDate": "29/02/2020",
				"kmValue": {
					"$numberInt": "123456"
				}
			}
		],
		"monthlyPayement":700,
		"km": {
			"$numberInt": "123456"
		},
		"lastKmUpdate": "29/02/2020",
		"payementTime": ""
	},
	{
		"_id": "b391289577e3999fdb3d26ab",
		"registration": "ER-972-LL",
		"kms": [
			{
				"_id": {
					"$oid": "f91fdb1f8e85c971de8db64d"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "b3a7c2a2f46c43a0d609afc5",
		"registration": "5",
		"kms": [
			{
				"_id": {
					"$oid": "61b9086cfde14ae2cfdbb9a9"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "01/01/2018"
			}
		],
		"monthlyPayement":0.08,
		"payementTime": "598cfbf8c12ca586119f6e0f"
	},
	{
		"_id": "b4f463a15b28dfeea6bd7296",
		"registration": "FJ-462-TL",
		"kms": [
			{
				"_id": {
					"$oid": "0ef97614783a2494ae4a6694"
				},
				"kmValue": {
					"$numberInt": "16450"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":620.78,
		"payementTime": ""
	},
	{
		"_id": "b513574392444e24279ed6da",
		"registration": "BJ-591-NX",
		"kms": [
			{
				"_id": {
					"$oid": "be0246c8d1d3f2dfc9363679"
				},
				"kmValue": {
					"$numberInt": "397128"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "b5c40d6c51e66e57b40e857e",
		"registration": "DK-599-MZ",
		"kms": [
			{
				"_id": {
					"$oid": "a14edbf26c68fe7fef78dc5c"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "12/05/2020"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "b97e82a9aa25fc591c4e6b3a",
		"registration": "DB-614-GR",
		"kms": [
			{
				"_id": {
					"$oid": "42f0deae323405910bc38003"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "12/12/2013"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "ba3f2c41fd60e7ef366a17f8",
		"registration": "ER-904-PR",
		"kms": [
			{
				"_id": {
					"$oid": "d3f4ec8d85ca8e0f6502755d"
				},
				"kmValue": {
					"$numberInt": "199700"
				},
				"reportDate": "23/03/2020"
			}
		],
		"monthlyPayement":721.69,
		"payementTime": ""
	},
	{
		"_id": "bddb5569c2dcc1001984ed43",
		"registration": "DW-155-TH",
		"kms": [
			{
				"_id": {
					"$oid": "b44233e0de0b7ca409eb40ca"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "12/05/2020"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "bf12dc7e16ed18b3ec8a3c72",
		"registration": "FF-933-CN",
		"kms": [
			{
				"_id": {
					"$oid": "0b75afc030e6a4234406bb01"
				},
				"kmValue": {
					"$numberInt": "53341"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":443.03,
		"payementTime": ""
	},
	{
		"_id": "bfd39e74764cc5fbe4f41c1a",
		"registration": "EL-909-PY",
		"kms": [
			{
				"_id": {
					"$oid": "928cf7ec3902b344560c0f8b"
				},
				"kmValue": {
					"$numberInt": "70413"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "c28a6cda16300feffd990891",
		"registration": "AY-494-CJ",
		"kms": [
			{
				"_id": {
					"$oid": "41561644e53fb6d834930f54"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "06/08/2010"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "c35b1a87f04862b8dd40ee81",
		"registration": "DY-180-XA",
		"kms": [
			{
				"_id": {
					"$oid": "7d9314fdea2c40bfe4f5b90a"
				},
				"kmValue": {
					"$numberInt": "194081"
				},
				"reportDate": "20/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "c54121a95b87ba3e9fb3f8da",
		"registration": "EH-241-NN",
		"kms": [
			{
				"_id": {
					"$oid": "5dd342b3156e65c4f8d9091a"
				},
				"kmValue": {
					"$numberInt": "199317"
				},
				"reportDate": "20/03/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "ca19cc8f22e46bf6eb40ab45",
		"registration": "EK-872-MM",
		"kms": [
			{
				"_id": {
					"$oid": "af1284b3b41f85c67afb4601"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "cdcaaf4d96d8bbaa7479431a",
		"registration": "ET-917-PJ",
		"kms": [
			{
				"_id": {
					"$oid": "188cabd9e60869c21d4e4e8d"
				},
				"kmValue": {
					"$numberInt": "63600"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":926.18,
		"payementTime": ""
	},
	{
		"_id": "ce007e248b67e5714dad2245",
		"registration": "EW-411-NN",
		"kms": [
			{
				"_id": {
					"$oid": "716fb9fdf353c07fc496554c"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "cfb8f1a8a9066575c5d67375",
		"registration": "DB-390-ZQ",
		"kms": [
			{
				"_id": {
					"$oid": "b82b74120ef1a06e683cfc4c"
				},
				"kmValue": {
					"$numberInt": "117080"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "d2c283d6fb65c3fe20586fbf",
		"registration": "FF-087-LP",
		"kms": [
			{
				"_id": {
					"$oid": "d515107c0285b82850f40956"
				},
				"kmValue": {
					"$numberInt": "48670"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":605.32,
		"payementTime": ""
	},
	{
		"_id": "d2d49e2e6ae97d930b9a54fb",
		"registration": "6",
		"kms": [
			{
				"_id": {
					"$oid": "a9f0f66a376dc560cde7b9ed"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "01/01/2018"
			}
		],
		"monthlyPayement":0.08,
		"payementTime": "598cfbf8c12ca586119f6e0f"
	},
	{
		"_id": "d408a8cd26ab955e6c08461f",
		"registration": "ES-516-TT",
		"kms": [
			{
				"_id": {
					"$oid": "d8512e77e1660efda76523c6"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "d53e9cd5338ffbac94e52f03",
		"registration": "DH-733-HK",
		"kms": [
			{
				"_id": {
					"$oid": "e079a03a3576cf6651f38072"
				},
				"kmValue": {
					"$numberInt": "131676"
				},
				"reportDate": "15/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "d584a1df0a052911098dedeb",
		"registration": "EK-346-VT",
		"kms": [
			{
				"_id": {
					"$oid": "ea4e6e15f11a2522ca035092"
				},
				"kmValue": {
					"$numberInt": "16120"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":830.925,
		"payementTime": ""
	},
	{
		"_id": "d5b1c3da19f1db967b437806",
		"registration": "EL-563-XK",
		"kms": [
			{
				"_id": {
					"$oid": "741b5094999a8ea2e7ec8df9"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "24/08/2017"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "db32a9e98dad347cdaca54cb",
		"registration": "DL-193-AM",
		"kms": [
			{
				"_id": {
					"$oid": "d0eeaea74ef9a2f4643ae4ba"
				},
				"kmValue": {
					"$numberInt": "223697"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "db84c172735fafc5f89c5feb",
		"registration": "EK-873-MM",
		"kms": [
			{
				"_id": {
					"$oid": "09e0efe0ee6b20315f61fde1"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "21/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "dd0fcb8bd4a129c17a3c7347",
		"registration": "DX-189-PP",
		"kms": [
			{
				"_id": {
					"$oid": "80e1521a8e1e1f84cfb6f934"
				},
				"kmValue": {
					"$numberInt": "302759"
				},
				"reportDate": "10/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "dd9f31ebf4ed400ffab91836",
		"registration": "CF-203-KA",
		"kms": [
			{
				"_id": {
					"$oid": "7e425d581d5e3bef97ecfc91"
				},
				"kmValue": {
					"$numberInt": "366811"
				},
				"reportDate": "21/11/2019"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "e200c7ceed5881c07a997adf",
		"registration": "DB-984-AB",
		"kms": [
			{
				"_id": {
					"$oid": "cb29033f9a359d8aa702a33b"
				},
				"kmValue": {
					"$numberInt": "228878"
				},
				"reportDate": "20/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "e228ebe430060eafe9e6bbea",
		"registration": "ER-969-JF",
		"kms": [
			{
				"_id": {
					"$oid": "25f251d8bf95d9f45ee227ec"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "e642c7e147e3afebcc418af5",
		"registration": "AG-641-SY",
		"kms": [
			{
				"_id": {
					"$oid": "e933b69c38c77b912280f704"
				},
				"kmValue": {
					"$numberInt": "313208"
				},
				"reportDate": "23/10/2018"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "e7fd0e70682874e19bf48f6d",
		"registration": "ER-800-JF",
		"kms": [
			{
				"_id": {
					"$oid": "6be7c50110bd0bf02ae5f5af"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "e81b0afe952cc924c3937394",
		"registration": "DK-520-TG",
		"kms": [
			{
				"_id": {
					"$oid": "12cc66914bdf29be8d11a4c0"
				},
				"kmValue": {
					"$numberInt": "184650"
				},
				"reportDate": "30/03/2020"
			}
		],
		"monthlyPayement":0,
		"payementTime": ""
	},
	{
		"_id": "e8450714c4d95c4106acb1f5",
		"registration": "DW-989-ZP",
		"kms": [
			{
				"_id": {
					"$oid": "b8ae092d2e226896916af762"
				},
				"kmValue": {
					"$numberInt": "105809"
				},
				"reportDate": "06/01/2019"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "ea3235d2fedafd1f0a367e2f",
		"registration": "EH-615-FT",
		"kms": [
			{
				"_id": {
					"$oid": "b5035c0b5013f540481db756"
				},
				"kmValue": {
					"$numberInt": "92900"
				},
				"reportDate": "31/01/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "eac4a3b3b5cf824e2e14a9de",
		"registration": "FF-598-BM",
		"kms": [
			{
				"_id": {
					"$oid": "cf976f6cfa6b4eb72ed7acac"
				},
				"kmValue": {
					"$numberInt": "64049"
				},
				"reportDate": "15/04/2020"
			}
		],
		"monthlyPayement":443.03,
		"payementTime": ""
	},
	{
		"_id": "ec1e7e9ada52e85398f5331b",
		"registration": "EH-780-CM",
		"kms": [
			{
				"_id": {
					"$oid": "744f8db65a4e1118da8efbaf"
				},
				"kmValue": {
					"$numberInt": "190261"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":449.36,
		"payementTime": ""
	},
	{
		"_id": "ee09638d1565aa4c3fe9894a",
		"registration": "DE-601-KN",
		"kms": [
			{
				"_id": {
					"$oid": "b3ee7fff724c9282910b957e"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "22/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "eec4d0b06f0d5eab88cef69d",
		"registration": "EM-537-LD",
		"kms": [
			{
				"_id": {
					"$oid": "1787e35e1eeb576115ea76e0"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "15/06/2017"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "ef6a423a6ea971527dfaf33b",
		"registration": "EP-259-ZX",
		"kms": [
			{
				"_id": {
					"$oid": "93281410acf956a31a505512"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "23/08/2017"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "f0d9b55e15b998434317b215",
		"registration": "DS-648-HD",
		"kms": [
			{
				"_id": {
					"$oid": "c42be1b0505c0eb2274c371d"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "12/06/2015"
			}
		],
		"monthlyPayement":0.03,
		"payementTime": "24bc2fb2aae684cf350a4624"
	},
	{
		"_id": "f2542b5c400b5e2a73d47ff9",
		"registration": "FM-891-SD",
		"kms": [
			{
				"_id": {
					"$oid": "3b45ab08ac8b0f5d3f35a8da"
				},
				"kmValue": {
					"$numberInt": "4060"
				},
				"reportDate": "16/04/2020"
			}
		],
		"monthlyPayement":443.52,
		"payementTime": ""
	},
	{
		"_id": "f27f4e682eb049c5c0d22222",
		"registration": "ER-576-GP",
		"kms": [
			{
				"_id": {
					"$oid": "729074d70b59e36057eee707"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "f3b776c3a6b4e2c80b6858e0",
		"registration": "FC-434-YE",
		"kms": [
			{
				"_id": {
					"$oid": "34af54db26a84eb28b7b53cc"
				},
				"kmValue": {
					"$numberInt": "51300"
				},
				"reportDate": "29/01/2020"
			}
		],
		"monthlyPayement":558.35,
		"payementTime": ""
	},
	{
		"_id": "f5903acb63ee136627b9b5f4",
		"registration": "FQ-004-DG",
		"kms": [
			{
				"_id": {
					"$oid": "d452be90f0e6aa3e2aa8fa0c"
				},
				"kmValue": {
					"$numberInt": "10"
				},
				"reportDate": "01/06/2020"
			}
		],
		"monthlyPayement":0,
		"payementTime": "9d49385669921ff7b07a0581"
	},
	{
		"_id": "f69ba0e7457603472911d59d",
		"registration": "DB-117-ZW",
		"kms": [
			{
				"_id": {
					"$oid": "b46625a89583bc9e960677fa"
				},
				"kmValue": {
					"$numberInt": "276743"
				},
				"reportDate": "14/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "f99dfb14334d00c4d408e703",
		"registration": "ER-344-XH",
		"kms": [
			{
				"_id": {
					"$oid": "cff6ba39b4fb05ea37f4a84d"
				},
				"kmValue": {
					"$numberInt": "1"
				},
				"reportDate": "17/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	},
	{
		"_id": "fac1ed79d0d38837a85adae5",
		"registration": "DB-224-HQ",
		"kms": [
			{
				"_id": {
					"$oid": "6580a004ab464c7d269530fc"
				},
				"kmValue": {
					"$numberInt": "147306"
				},
				"reportDate": "20/04/2020"
			}
		],
		"monthlyPayement":1,
		"payementTime": ""
	}
]

export default {
    Query : {
        testThis(obj, args,{user}){
            if(user._id){
                try{
                    /*
                    let licences = Licences.find({}).fetch();
                    let nuked = 0;
                    licences.map(l=>{
                        if(l.vehicle.length > 0){
                            let vehicles = Vehicles.find({_id:l.vehicle}).fetch();
                            if(vehicles.length == 0){
                                nuked++;
                                Licences.update(
                                    {
                                        _id:l._id
                                    },
                                    {
                                        $set: {
                                            vehicle:""
                                        }
                                    },
                                    {multi:true}
                                );
                            }
                        }
                    })*/
                    /*Vehicles.update(
                        {},{
                            $set: {
                                payementEndDate:"",
                                monthlyPayement:0
                            }
                        },
                        {multi:true}
                    );*/
                    data.map(v=>{
                        console.log(v.registration + " : " + v.monthlyPayement)
                        Vehicles.update(
                            {
                                _id: new Mongo.ObjectID(v._id)
                            },{
                                $set: {
                                    monthlyPayement:v.monthlyPayement
                                }
                            }
                        );
                    })
                    return [{status:true,message:'Nuked : repaired the epic fail'}];
                }catch(e){
                    throw e;
                    return [{status:false,message:e.message}];
                }
                
            }
            throw new Error('Unauthorized');
        }
    }
}