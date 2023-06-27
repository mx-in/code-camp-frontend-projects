export default function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <nav>
          <ul>
            <li>
              <a href="drum">drum</a>
            </li>
            <li>
              <a href="markdown">markdown</a>
            </li>
            <li>
              <a href="quote">quote</a>
            </li>
            <li>
              <a href={'contacts/2'}>Your Friend</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
