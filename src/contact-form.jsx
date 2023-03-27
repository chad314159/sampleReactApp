'use strict';
var React = require('react');
var ContactForm = React.createClass({


  getInitialState: function() {
    return {
      type: 'info',
      message: ''
    };
  },
  /**
   * Form submission callback.
   */
  handleSubmit: function (event) {
    event.preventDefault();
    // Scroll to the top of the page to show the status message.
    document.getElementById('heading').scrollIntoView();
    this.setState({ type: 'info', message: 'Sending...' }, this.sendFormData);
  },
  /**
   * Submits form data to the web server.
   */
  sendFormData: function () {
    // Prepare form data for submitting it.
    var formData = {
      classification: React.findDOMNode(this.refs.classification).value,
      organization: React.findDOMNode(this.refs.company).value,
      email: React.findDOMNode(this.refs.email).value,
      name: React.findDOMNode(this.refs.name).value,
      phone: React.findDOMNode(this.refs.phone).value,
      target: React.findDOMNode(this.refs.object).value,
      imagery: React.findDOMNode(this.refs.imageType).value,
    };

    // Extract the checked box values
    formData.verb = this.getSelected('areas');
    formData.timeline = this.getSelected('when');

    // Send the form data.
    var xmlhttp = new XMLHttpRequest();
    var _this = this;
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        var response = JSON.parse(xmlhttp.responseText);
        if (xmlhttp.status === 200 && response.status === 'OK') {
          _this.setState({ type: 'success', message: 'We have received your request. Thanks!' });
        }
        else {
          _this.setState({ type: 'danger', message: 'Sorry, there has been an error. Please try again later or send us an email to Michael Ficken at mike_ficken@nga.mil.' });
        }
      }
    };
    xmlhttp.open('POST', 'send', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(this.requestBuildQueryString(formData));
  },
  /**
   * Transforms an object into a URL querystring.
   *
   * @param object params
   * @return string the formatted querystring.
   */
  requestBuildQueryString: function (params) {
    var queryString = [];
    for(var property in params)
      if (params.hasOwnProperty(property)) {
        queryString.push(encodeURIComponent(property) + '=' + encodeURIComponent(params[property]));
      }
    return queryString.join('&');
  },
  /**
   * Extracts selected values from checkboxes and radios.
   *
   * @param string fieldName
   * @return string the selected value(s).
   */
  getSelected: function (fieldName) {
    var i;
    var fields = document.getElementsByName(fieldName);
    var selectedFields = [];
    for (i = 0; i < fields.length; i++) {
      if (fields[i].checked === true) {
        selectedFields.push(fields[i].value);
      }
    }
    return selectedFields.join(', ');
  },
  /**
   * Renders the component.
   * https://facebook.github.io/react/docs/component-specs.html#render
   */
  render: function() {
    if (this.state.type && this.state.message) {
      var classString = 'alert alert-' + this.state.type;
      var status = <div id="status" className={classString} ref="status">
                     {this.state.message}
                   </div>;
    }
    return (
      <div>
        <h1 id="heading">Needs DB Initial Request Form (Draft #1)</h1>
        <p>This is a proof of concept application. </p>

        {status}
        <form action="" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name: *</label>
            <input className="form-control" name="name" ref="name" required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="company">Organization: *</label>
            <input className="form-control" name="company" ref="company" required type="text" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email: *</label>
            <input className="form-control" name="email" ref="email" required type="email" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone: *</label>
            <input className="form-control" name="phone" ref="phone" required type="phone" />
          </div>


          <h3>Request Type&#63; *</h3>
          <div className="form-group">
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Detect" />Detect</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Monitor" />Monitor</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Verify" />Verify</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Identify" />Identifiy</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Characterize" />Characterize</label>
            <label className="checkbox-inline"><input name="areas" ref="areas" type="checkbox" value="Describe" />Describe</label>
          </div>

          <h3>Timeline&#63; *</h3>
          <div className="form-group">
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="Immediately" /><span>Urgent</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="1-3 months" /><span>1-2 weeks</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="3-6 months" /><span>3-4 weeks</span></label>
            <label className="radio-inline"><input name="when" ref="when" type="radio" value="4+" /><span>4 + weeks</span></label>
          </div>

          <div className="form-group">
            <label htmlFor="classification">Classification restrictions? *</label>
            <input className="form-control" name="classification" ref="classification" type="text" />
          </div>

          <div className="form-group">
            <label htmlFor="object">Describe the object*</label>
            <textarea className="form-control" name="object" ref="object" rows="4" />
          </div>

          <div className="form-group">
            <label htmlFor="referral">Imagery type&#63;</label>
            <input className="form-control" name="imageType" ref="imageType" type="text" />
          </div>

          <div className="form-group">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = ContactForm;
