// Sample data for track 1
var sampleTrack1Data = "%MNRAMSEY^DENHAM$SHAUN$PATRICK^5555 222TH AVE NW^?";

// Sample data for track 2 (for demonstration purposes)
var sampleTrack2Data = ";63603813519844658009=2809197709149?";

// Function to parse track 1 data
function parseTrack1Data(data) {
    var result = {
        State: "",
        City: "",
        LastName: "",
        FirstName: "",
        MiddleName: "",
        Address: "",
        Unknown: ""
    };

    // Remove the start and end sentinels
    if (data.startsWith('%') && data.endsWith('?')) {
        data = data.slice(1, -1); // Remove the '%' and '?'

        // Split data into parts using the field separators
        var parts = data.split('^');
        if (parts.length >= 4) {
            var stateAndCity = parts[0];
            var namesAndAddress = parts.slice(1);

            // Extract state
            result.State = stateAndCity.substring(0, 2);

            // Extract city (may use up to 13 characters)
            var cityEnd = Math.min(stateAndCity.length, 15); // 2 chars for state + max 13 chars for city
            result.City = stateAndCity.substring(2, cityEnd);

            // Extract the remaining parts
            if (namesAndAddress.length >= 3) {
                var namesPart = namesAndAddress[0]; // This may include names and the next field separator
                var addressAndUnknown = namesAndAddress.slice(1);

                // Extract last name, first name, and middle name
                var nameParts = namesPart.split('$');
                if (nameParts.length === 3) {
                    result.LastName = nameParts[0] || "";
                    result.FirstName = nameParts[1] || "";
                    result.MiddleName = nameParts[2] || "";
                }

                // Extract address and unknown parts
                result.Address = addressAndUnknown[0] || "";
                result.Unknown = addressAndUnknown.slice(1).join('^') || "";
            }
        }
    }

    return result;
}

// Function to parse track 2 data
function parseTrack2Data(data) {
    var result = { LicenseNumber: "", DOB: "", DOB_FORMAT: "" };

    // Remove the start and end sentinels
    if (data.startsWith(';') && data.endsWith('?')) {
        data = data.slice(1, -1); // Remove the ';' and '?'

        // Split data into fields using '=' as the field separator
        var fields = data.split('=');
        if (fields.length >= 2) {
            var licenseData = fields[0]; // Contains state IIN and license number
            var dobData = fields[1]; // Contains DOB and potentially more

            // Extract license number (starts after 6 chars of state IIN)
            result.LicenseNumber = licenseData.substring(6); // Adjust according to the actual license number length

            // Extract DOB (assumes format DDMMYYYY)
            var dob = dobData.substring(0, 8); // Adjust if different format
            result.DOB = dob;

            // Convert DOB to detailed format
            if (dob.length === 8) {
                var day = dob.substring(0, 2);
                var month = dob.substring(2, 4);
                var year = dob.substring(4, 8);

                // Create a valid date format (YYYY-MM-DD)
                var formattedDate = `${year}-${month}-${day} 00:00:00`;
                result.DOB_FORMAT = formattedDate;
            }
        }
    }

    return result;
}

// Run the functions with the sample track 1 and track 2 data
var track1Data = parseTrack1Data(sampleTrack1Data);
var track2Data = parseTrack2Data(sampleTrack2Data);

// Merge the results
var finalData = { ...track1Data, ...track2Data };
console.log(finalData);
