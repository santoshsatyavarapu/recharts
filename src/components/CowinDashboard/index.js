// Write your code here
// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationCoverage: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
  }

  componentDidMount() {
    this.getCovidDetails()
  }

  getCovidDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const fetchedData = await response.json()

      const vaccinationCoverageArray = fetchedData.last_7_days_vaccination
      const vaccinationByAge = fetchedData.vaccination_by_age
      const vaccinationByGender = fetchedData.vaccination_by_gender

      const vaccinationCoverage = vaccinationCoverageArray.map(eachElement => {
        const objectToReturn = {
          vaccineDate: eachElement.vaccine_date,
          dose1: eachElement.dose_1,
          dose2: eachElement.dose_2,
        }
        return objectToReturn
      })

      this.setState({
        apiStatus: apiStatusConstants.success,
        vaccinationCoverage,
        vaccinationByAge,
        vaccinationByGender,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  render() {
    const {
      apiStatus,
      vaccinationCoverage,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state

    return (
      <div className="bg-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="logo-heading">Co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>
        {apiStatus === 'SUCCESS' && (
          <VaccinationCoverage vaccinationCoverage={vaccinationCoverage} />
        )}
        {apiStatus === 'SUCCESS' && (
          <VaccinationByAge vaccinationByAge={vaccinationByAge} />
        )}
        {apiStatus === 'SUCCESS' && (
          <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        )}

        {apiStatus === 'FAILURE' && (
          <img
            src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
            alt="failure view"
            className="image-view"
          />
        )}
        {apiStatus === 'IN_PROGRESS' && (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
          </div>
        )}
      </div>
    )
  }
}

export default CowinDashboard
