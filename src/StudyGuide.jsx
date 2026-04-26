import { useState } from "react";

const experiments = [
  {
    id: 3,
    title: "PHP Form Validation",
    emoji: "✅",
    color: "#6366f1",
    bg: "#eef2ff",
    aim: "Build a registration form and validate user inputs using PHP.",
    whatItDoes: "A single PHP+HTML page where the form submits to itself (action=\"\"). PHP checks inputs BEFORE showing the form. If something is wrong, it shows a red error message next to that field.",
    keyIdeas: [
      { term: "$_POST", def: "Superglobal array — holds data submitted via POST method. Access fields by name: $_POST['firstname']" },
      { term: "$_GET", def: "Superglobal array — holds data sent via URL (query string). e.g. page.php?name=John" },
      { term: "isset()", def: "Checks if a variable exists and is not null. Used to detect if the form was submitted: isset($_POST['submit'])" },
      { term: "empty()", def: "Returns true if a field is blank/empty. Used to check required fields." },
      { term: "preg_match()", def: "Tests a string against a regex pattern. e.g. preg_match(\"/^[a-zA-Z ]*$/\", $name) — only letters allowed." },
      { term: "trim()", def: "Removes extra spaces from start/end of input." },
    ],
    code: `<?php
$nameErr = $genderErr = ""; // error messages
$name = $gender = "";       // actual values

if (isset($_POST['submit'])) {  // form was submitted
  if (empty($_POST["firstname"])) {
    $nameErr = "First Name is required";
  } else {
    $name = trim($_POST['firstname']);
    if (!preg_match("/^[a-zA-Z ]*$/", $name)) {
      $nameErr = "Only letters allowed";
    }
  }
  // repeat for other fields...
}
?>
<!-- HTML form below — action="" means submit to same page -->
<form method="post" action="">
  <input type="text" name="firstname" value="<?php echo $name; ?>">
  <span style="color:red"><?php echo $nameErr; ?></span>
  <input type="submit" name="submit" value="Submit">
</form>`,
    examTips: [
      "action=\"\" means the form submits to itself (same page handles validation)",
      "isset($_POST['submit']) detects if Submit button was clicked",
      "Show old values back in inputs using value=\"<?php echo $name; ?>\" so user doesn't retype",
      "preg_match needs regex pattern in / / slashes",
    ],
  },
  {
    id: 4,
    title: "Electricity Bill (PHP + HTML)",
    emoji: "⚡",
    color: "#f59e0b",
    bg: "#fffbeb",
    aim: "Take previous and present meter readings from HTML form, calculate bill using tariff slabs in PHP.",
    whatItDoes: "Two files: Ebill.html (the form using GET) and Ebill.php (does the math and prints a table). The PHP file receives values from the URL, calculates units consumed, applies the correct rate, and echoes an HTML table.",
    keyIdeas: [
      { term: "GET method", def: "Form data is sent in the URL: Ebill.php?consumer_number=123&units=150. Accessed via $_GET['fieldname']" },
      { term: "if / else if / else", def: "Used to pick the right tariff slab based on units consumed." },
      { term: "echo", def: "Prints output (HTML or text) to the browser." },
      { term: "Tariff slabs", def: "<100 → ₹3/unit | 100–200 → ₹4/unit | 200–300 → ₹5/unit | >300 → ₹6/unit" },
    ],
    code: `// Ebill.html → sends data via GET to Ebill.php
<form action="Ebill.php" method="get">
  <input type="text" name="consumer_number">
  <input type="text" name="previous_reading">
  <input type="text" name="present_reading">
  <input type="submit" value="Calculate">
</form>

// Ebill.php
<?php
$prev = $_GET["previous_reading"];
$pres = $_GET["present_reading"];
$unit = $pres - $prev;  // units consumed

if ($unit < 100) {
  $amt = $unit * 3;
} else if ($unit <= 200) {
  $amt = $unit * 4;
} else if ($unit <= 300) {
  $amt = $unit * 5;
} else {
  $amt = $unit * 6;
}

echo "<table>";
echo "<tr><td>Units</td><td>$unit</td></tr>";
echo "<tr><td>Amount</td><td>$amt</td></tr>";
echo "</table>";
?>`,
    examTips: [
      "GET puts data in URL — POST doesn't. Both are accessed as superglobals.",
      "Units = present reading − previous reading",
      "The slabs are: <100, 100-200, 200-300, >300",
      "echo can print HTML strings directly — use single quotes inside double-quoted echo strings",
    ],
  },
  {
    id: 5,
    title: "Session Handling",
    emoji: "🔐",
    color: "#10b981",
    bg: "#ecfdf5",
    aim: "Implement a page view counter using PHP sessions — count how many times a user has visited in one session.",
    whatItDoes: "Every time the user loads the page, $_SESSION['view'] increases by 1. The count is stored on the SERVER (not the browser), tied to that specific user's session. When they close the browser, the session ends.",
    keyIdeas: [
      { term: "session_start()", def: "MUST be the very first thing in the PHP file — before ANY HTML output. Starts or resumes a session." },
      { term: "$_SESSION", def: "Superglobal array to store session data. e.g. $_SESSION['view'] = 5. Persists across page loads for the same user." },
      { term: "isset()", def: "Check if session variable exists before using it, to avoid errors on first visit." },
      { term: "Session vs Cookie", def: "Session data lives on the server. Cookies live in the browser. Sessions are more secure." },
    ],
    code: `<?php
session_start();  // ← MUST be first line, before <html>

// If 'view' exists, increase it. If not, start at 1.
if (isset($_SESSION['view'])) {
  $_SESSION['view'] = $_SESSION['view'] + 1;
} else {
  $_SESSION['view'] = 1;
}
?>
<html>
<body>
  <?php
    echo "Page views this session: " . $_SESSION['view'];
  ?>
</body>
</html>`,
    examTips: [
      "session_start() must come BEFORE the <html> tag — even one space before it causes errors",
      "Use isset() to check if session variable exists before accessing it",
      "Session data is TEMPORARY — deleted when browser closes",
      "The shorthand from your file: isset($_SESSION['count']) ? $_SESSION['count']++ : $_SESSION['count'] = 1; — same logic, one line",
    ],
  },
  {
    id: 6,
    title: "File Operations",
    emoji: "📁",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    aim: "Read, write, copy files using PHP file handling functions.",
    whatItDoes: "Opens sample.txt, reads it different ways (whole file, line by line, character by character), then creates a new file, writes to it, copies it, and reads the copy.",
    keyIdeas: [
      { term: "fopen($file, $mode)", def: "Opens a file. Modes: 'r'=read, 'w'=write (clears file), 'a'=append, 'r+'=read+write" },
      { term: "fclose($file)", def: "Always close the file after use — frees up memory." },
      { term: "fread($file, $size)", def: "Reads $size bytes from file. Use filesize('filename') to read the whole thing." },
      { term: "fgets($file)", def: "Reads one LINE from file." },
      { term: "fgetc($file)", def: "Reads one CHARACTER at a time." },
      { term: "feof($file)", def: "Returns true when end of file is reached. Used in while loops." },
      { term: "fwrite($file, $text)", def: "Writes $text to the file." },
      { term: "copy($src, $dest)", def: "Copies a file from source to destination path." },
    ],
    code: `<?php
// READ entire file at once
$file = fopen("sample.txt", "r") or exit("Cannot open!");
fread($file, filesize("sample.txt"));
fclose($file);

// READ first line only
$file = fopen("sample.txt", "r");
echo fgets($file);   // one line
fclose($file);

// READ character by character until end
$file = fopen("sample.txt", "r");
while (!feof($file)) {
  echo fgetc($file);  // one character
}
fclose($file);

// WRITE to new file
$file = fopen("sampl2.txt", "w");
fwrite($file, "Hello World. Testing!");
fclose($file);

// COPY file
copy("sampl2.txt", "sampl3.txt");

// READ the copy
$file = fopen("sampl3.txt", "r");
echo fgets($file);
fclose($file);
?>`,
    examTips: [
      "Always fclose() after fopen() — it's like closing a drawer",
      "fread() reads bytes — use filesize() as the size to read everything",
      "fgets() = one line | fgetc() = one character",
      "feof() = 'is it the end of the file?' — loop while NOT feof",
      "Mode 'w' CLEARS the file first! Use 'a' to append without deleting",
    ],
  },
  {
    id: 7,
    title: "Employee Details — HTML Form + File Storage",
    emoji: "👨‍💼",
    color: "#ef4444",
    bg: "#fef2f2",
    aim: "Accept employee salary details from an HTML form, save to a text file, then read and display it.",
    whatItDoes: "3 files work together: Menu.html (links), EnterDetails.html (form), Employee.php (saves to emp.txt), EmpDetails.php (reads emp.txt and displays salary table). Data is separated by <=> in the file.",
    keyIdeas: [
      { term: "explode(separator, string)", def: "Splits a string into an array using a separator. e.g. explode('<=>', 'John<=>50000') → ['John', '50000']" },
      { term: "fgets(fopen(...))", def: "Shorthand — open and read first line in one go." },
      { term: "Salary formula", def: "Total = Basic + (Basic × DA%) + (Basic × HRA%)" },
      { term: "File as database", def: "This experiment stores data in a .txt file instead of a database — simpler but only holds one employee at a time." },
    ],
    code: `// Employee.php — saves form data to file
<?php
$name = $_GET["Name"];
$bp   = $_GET["BP"];    // Basic Pay
$da   = $_GET["DA"];    // DA percentage
$hra  = $_GET["HRA"];   // HRA percentage

$file = fopen("emp.txt", "w+") or die("File failed");
fwrite($file, $name."<=>".$bp."<=>".$da."<=>".$hra);
echo "File Created";
?>

// EmpDetails.php — reads and displays
<?php
// Read the line and split by <=>
$emp   = explode("<=>", fgets(fopen("emp.txt","r")));
// $emp[0]=name, $emp[1]=BP, $emp[2]=DA%, $emp[3]=HRA%

$total = ($emp[1]*$emp[2]/100) + ($emp[1]*$emp[3]/100) + $emp[1];
?>
<table>
  <tr><td>Name</td>    <td><?php echo $emp[0]; ?></td></tr>
  <tr><td>Basic Pay</td><td><?php echo $emp[1]; ?></td></tr>
  <tr><td>Total Pay</td><td><?php echo $total; ?></td></tr>
</table>`,
    examTips: [
      "explode('<=>',  string) splits by the <=> separator — values go into array positions [0],[1],[2],[3]",
      "Total Pay = Basic + (Basic × DA/100) + (Basic × HRA/100)",
      "fopen with 'w+' creates the file if it doesn't exist",
      "The form uses GET — data comes through URL, read with $_GET",
    ],
  },
  {
    id: 8,
    title: "PHP + MySQL Web Application",
    emoji: "🗄️",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    aim: "Connect PHP to a MySQL database, insert employee data, and retrieve/display it.",
    whatItDoes: "PHP connects to MySQL using mysqli functions. One page inserts records into a table. Another searches by employee name and displays their designation and salary.",
    keyIdeas: [
      { term: "mysqli_connect(host, user, pass)", def: "Opens a connection to MySQL server. e.g. mysqli_connect('localhost','root','')" },
      { term: "mysqli_select_db($con, $dbname)", def: "Selects which database to use on that connection." },
      { term: "mysqli_query($con, $sql)", def: "Runs an SQL query (SELECT, INSERT, etc.) on the database." },
      { term: "mysqli_fetch_assoc($result)", def: "Gets one row from query result as an associative array (column names as keys)." },
      { term: "mysqli_close($con)", def: "Closes the database connection." },
      { term: "die()", def: "Stops execution and prints a message — used if connection fails." },
    ],
    code: `// dbconnect.php — connection setup
<?php
$con = mysqli_connect("localhost", "root", "");
if (!$con) { die("Couldn't connect"); }

$db = mysqli_select_db($con, "employee");
if (!$db) { die("Couldn't select database"); }
?>

// Search and display (simplified)
<?php
include("dbconnect.php");

if (isset($_POST['submit'])) {
  $name = $_POST['name'];
  
  // Run SELECT query
  $result = mysqli_query($con,
    "SELECT * FROM emp WHERE name='$name'");
  
  // Fetch the row
  $row = mysqli_fetch_assoc($result);
  
  $desig  = $row['designation'];
  $salary = $row['salary'];
}
?>
<form method="post">
  <input type="text" name="name" placeholder="Employee name">
  <input type="submit" name="submit">
</form>
<p>Name: <?php echo $name; ?></p>
<p>Designation: <?php echo $desig; ?></p>
<p>Salary: <?php echo $salary; ?></p>`,
    examTips: [
      "Connection order: mysqli_connect() → mysqli_select_db() → mysqli_query() → fetch → mysqli_close()",
      "mysqli_fetch_assoc() returns columns as $row['column_name']",
      "Always check if connection succeeded — use if(!$con) die(...)",
      "SELECT * FROM tablename WHERE column='value' — basic search query",
      "include('dbconnect.php') reuses the connection code in other files",
    ],
  },
];

export default function StudyGuide() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("concept");

  const exp = active !== null ? experiments[active] : null;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", borderRadius: 16, padding: "24px 28px", marginBottom: 20, color: "white" }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>📚 Exam in 2 days — you got this!</div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>PHP Lab Experiments 3–8</h1>
          <p style={{ margin: "8px 0 0", opacity: 0.8, fontSize: 14 }}>Tap any experiment to study it. Covers what it does, key terms, code & exam tips.</p>
        </div>

        {/* Experiment Cards */}
        {active === null ? (
          <div style={{ display: "grid", gap: 12 }}>
            {experiments.map((e, i) => (
              <button
                key={e.id}
                onClick={() => { setActive(i); setTab("concept"); }}
                style={{
                  background: "white", border: `2px solid ${e.color}20`, borderRadius: 14,
                  padding: "18px 20px", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.15s",
                }}
                onMouseEnter={ev => ev.currentTarget.style.boxShadow = `0 4px 20px ${e.color}30`}
                onMouseLeave={ev => ev.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
              >
                <div style={{ width: 52, height: 52, background: e.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {e.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>Exp {e.id}: {e.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{e.aim}</div>
                </div>
                <div style={{ color: e.color, fontSize: 20 }}>→</div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            {/* Back button */}
            <button onClick={() => setActive(null)} style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#475569", fontSize: 14, marginBottom: 14, fontWeight: 600 }}>
              ← Back to all experiments
            </button>

            {/* Experiment Detail */}
            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
              {/* Header bar */}
              <div style={{ background: `linear-gradient(135deg, ${exp.color}, ${exp.color}cc)`, padding: "20px 24px", color: "white" }}>
                <div style={{ fontSize: 13, opacity: 0.85 }}>Experiment {exp.id}</div>
                <h2 style={{ margin: "4px 0 6px", fontSize: 22, fontWeight: 800 }}>{exp.emoji} {exp.title}</h2>
                <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>{exp.aim}</p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1.5px solid #f1f5f9", padding: "0 24px" }}>
                {["concept", "code", "tips"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      background: "none", border: "none", padding: "14px 16px 12px",
                      cursor: "pointer", fontWeight: 600, fontSize: 14,
                      color: tab === t ? exp.color : "#94a3b8",
                      borderBottom: tab === t ? `2.5px solid ${exp.color}` : "2.5px solid transparent",
                      textTransform: "capitalize",
                    }}
                  >
                    {t === "concept" ? "📖 Concepts" : t === "code" ? "💻 Code" : "💡 Exam Tips"}
                  </button>
                ))}
              </div>

              <div style={{ padding: "24px" }}>
                {tab === "concept" && (
                  <div>
                    {/* What it does */}
                    <div style={{ background: exp.bg, borderRadius: 10, padding: "14px 16px", marginBottom: 20, borderLeft: `4px solid ${exp.color}` }}>
                      <div style={{ fontWeight: 700, color: exp.color, fontSize: 13, marginBottom: 6 }}>WHAT THIS EXPERIMENT DOES</div>
                      <div style={{ color: "#334155", fontSize: 14, lineHeight: 1.6 }}>{exp.whatItDoes}</div>
                    </div>

                    {/* Key terms */}
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15, marginBottom: 12 }}>Key Terms & Functions</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {exp.keyIdeas.map((k, i) => (
                        <div key={i} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                          <code style={{ color: exp.color, fontWeight: 700, fontSize: 14, background: exp.bg, padding: "2px 8px", borderRadius: 4 }}>{k.term}</code>
                          <div style={{ color: "#475569", fontSize: 13.5, marginTop: 6, lineHeight: 1.5 }}>{k.def}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === "code" && (
                  <div>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15, marginBottom: 12 }}>Simplified, Commented Code</div>
                    <pre style={{
                      background: "#0f172a", color: "#e2e8f0", borderRadius: 12, padding: "20px",
                      fontSize: 13, lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}>
                      {exp.code}
                    </pre>
                  </div>
                )}

                {tab === "tips" && (
                  <div>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15, marginBottom: 12 }}>⚡ Remember These for the Exam</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {exp.examTips.map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: exp.bg, borderRadius: 8, padding: "12px 14px" }}>
                          <div style={{ background: exp.color, color: "white", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                          <div style={{ color: "#334155", fontSize: 14, lineHeight: 1.5 }}>{tip}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prev/Next */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, gap: 10 }}>
              <button
                onClick={() => { setActive(Math.max(0, active - 1)); setTab("concept"); }}
                disabled={active === 0}
                style={{ flex: 1, background: "white", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px", cursor: active === 0 ? "default" : "pointer", color: active === 0 ? "#cbd5e1" : "#475569", fontWeight: 600, fontSize: 14 }}
              >
                ← Prev
              </button>
              <button
                onClick={() => { setActive(Math.min(experiments.length - 1, active + 1)); setTab("concept"); }}
                disabled={active === experiments.length - 1}
                style={{ flex: 1, background: "white", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px", cursor: active === experiments.length - 1 ? "default" : "pointer", color: active === experiments.length - 1 ? "#cbd5e1" : "#475569", fontWeight: 600, fontSize: 14 }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Quick reference footer */}
        {active === null && (
          <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", marginTop: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>🧠 Quick Superglobals Cheat Sheet</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["$_POST['key']", "Form data via POST method"],
                ["$_GET['key']", "Data from URL / GET method"],
                ["$_SESSION['key']", "Per-user server-side data"],
                ["isset($var)", "Check if variable exists"],
                ["empty($var)", "Check if blank/null/0"],
                ["echo", "Print to browser"],
              ].map(([term, def]) => (
                <div key={term} style={{ background: "#f8fafc", borderRadius: 6, padding: "8px 10px" }}>
                  <code style={{ color: "#6366f1", fontSize: 12, fontWeight: 700 }}>{term}</code>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{def}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
